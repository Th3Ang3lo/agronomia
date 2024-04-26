import { csvConcurrentReader } from 'csv-concurrent-reader';
import Config from './config.js';
import FileHelper from './helpers/file-helper.js';
import { Writer } from './writer.js';

async function main() {
    const path = Config.getPath();

    const files = FileHelper.getAllCSVPaths(path);

    await Writer.execute(files);
}

await main();