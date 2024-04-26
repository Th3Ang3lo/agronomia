import { csvConcurrentReader } from "csv-concurrent-reader";

import Config from "./config.js";
import ObjectHelper from './helpers/object-helper.js';

export class Writer {
    static async execute(files) {
        const columns = Config.getColumns();
        const identifier = Config.getIdentifier();

        for (const file of files) {
            const metrics = new Map();
            const totals = new Map();

            await csvConcurrentReader(file.path, function(data) {
                const identifierValue = data?.[identifier.column];

                if(identifierValue == '2008-01-01') {
                    console.log(identifierValue);
                    console.log(file);

                    if(metrics.has(identifierValue)) {
                        const dataToMerge = metrics.get(identifierValue);

                        metrics.set(identifierValue, ObjectHelper.mergeObjects(dataToMerge));
                    } else {
                        metrics.set(identifierValue, ObjectHelper.replaceCommasWithDotsAndConvertToNumber(data));
                    }
                }
            }, 100, 1000, {
                skipComments: true,
                separator: Config.getSeparator(),
                skipLines: Config.getStartLine()
            })

            console.log(metrics);
            process.exit();
        }
    }
}