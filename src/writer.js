import fs from 'node:fs';
import { csvConcurrentReader } from "csv-concurrent-reader";

import Config from "./config.js";
import ObjectHelper from "./helpers/object-helper.js";
import { basename } from 'node:path';

export class Writer {
    static async execute(files) {
        const columns = Config.getColumns();
        const identifier = Config.getIdentifier();
        const separator = Config.getSeparator();

        for (const file of files) {
            const metrics = {};
            const totals = {};

            let continueCurrentLoop = false;

            await csvConcurrentReader(file.path, function(data) {
                const identifierValue = data?.[identifier.column];

                if (!identifierValue) {
                    continueCurrentLoop = true;
                }

                data = ObjectHelper.convertStringToNumbers(data);

                for (const [column, value] of Object.entries(data)) {
                    if(value < 0) {
                        continue;
                    }

                    if(!metrics?.[identifierValue]) {
                        metrics[identifierValue] = {};
                        totals[identifierValue] = {};
                    }

                    if(metrics?.[identifierValue]?.[column]) {
                        if (typeof value == 'number' && value >= 0) {
                            metrics[identifierValue][column] += value;
                            totals[identifierValue][column]++;
                        }
                    } else {
                        metrics[identifierValue][column] = value;
                        totals[identifierValue][column] = 1;
                    }
                }
            }, 100, 1000, {
                skipComments: true,
                separator,
                skipLines: Config.getStartLine()
            });

            if(continueCurrentLoop) {
                console.log(`Não pode calcular ${basename(file.path)}. Identificador inexistente (${identifier.column}).`);
                continue;
            }

            for (const key in metrics) {
                for (const [column, value] of Object.entries(metrics[key])) {
                    if(typeof value == 'number' && value > 0) {
                        if(Config.getOperator(column) == 'medium') {
                            metrics[key][column] = value / totals[key][column];
                        }
                    }
                } 
            }

            if(!fs.existsSync(file.outputDir)) {
                fs.mkdirSync(file.outputDir, { recursive: true });
            }

            const fileWriteStream = fs.createWriteStream(file.output);

            console.log(`Processando: ${basename(file.output)}`);

            const headerLine = columns.map(column => column.column).join(separator);
            fileWriteStream.write(headerLine + '\n');

            for (let data of Object.values(metrics)) {
                const identifierValue = data?.[identifier.column];

                const dataLine = columns.map(column => data[column.column]).join(separator);

                if(!identifierValue) {
                    continue;
                }

                fileWriteStream.write(dataLine + '\n');
            }
            
            fileWriteStream.end();

            console.log(`Finalizado: ${basename(file.output)}`);
        }

        console.log("Todos os processos foram finalizados.");
    }
}