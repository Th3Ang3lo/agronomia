import fs from 'node:fs';
import { csvConcurrentReader } from "csv-concurrent-reader";

import Config from "./config.js";
import ObjectHelper from "./helpers/object-helper.js";
import { error } from 'node:console';

export class Writer {
    static async execute(files) {
        const columns = Config.getColumns();
        const identifier = Config.getIdentifier();
        const separator = Config.getSeparator();

        for (const file of files) {
            const metrics = {};
            const totals = {};

            await csvConcurrentReader(file.path, function(data) {
                const identifierValue = data?.[identifier.column];

                data = ObjectHelper.convertStringToNumbers(data);

                for (const [column, value] of Object.entries(data)) {
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

            const header = columns.map(column => column.column).join(separator);
            // console.log(header);

            for (const [column, value] in Object.entries(metrics)) {
                // const dataToWrite = 
                console.log({ column, value });
            }

            /*
            
            const fileWriteStream = fs.createWriteStream(file.output);
            fileWriteStream.write("test\n");

            fileWriteStream.end();

            */
        }
    }
}