import { readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import Config from '../config.js';

export default class FileHelper {
    /** 
     * @returns { path: string, output: string }
     */
    static getAllCSVPaths(directory, csvFiles = []) {
        const directoryContent = readdirSync(directory);
    
        for (const item of directoryContent) {
            const itemPath = resolve(directory, item);
        
            if (statSync(itemPath).isDirectory()) {
                this.getAllCSVPaths(itemPath, csvFiles);
            } else {
                if (extname(itemPath).toLowerCase() === '.csv') {
                    const outputPath = join(Config.getPath(), "output", itemPath.replace(dirname(directory), ""));

                    csvFiles.push({
                        path: itemPath,
                        output: outputPath
                    });
                }
            }
        }

        return csvFiles;
    }
}