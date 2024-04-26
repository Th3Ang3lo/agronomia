import fs from "node:fs";

import config from '../config.json' assert { type: "json" };

export default class Config {
    static _validateColumns() {
        const columns = config?.columns;

        if (columns.length < 1) {
            throw new Error(`"Columns" property not contains any column.`);
        }

        const identifiers = columns.filter(column => column?.identifier);

        if (identifiers.length > 1) {
            throw new Error(`There more than 1 identifiers.`);
        }

        if (identifiers.length < 1) {
            throw new Error(`Is required 1 identifier.`);
        }

        const identifier = identifiers[0];
        if(!identifier?.format) {
            throw new Error(`Identifier format is required.`);
        }
    }

    static getColumns() {
        this._validateColumns();
        const columns = config?.columns;

        return columns;
    }

    static getIdentifier() {
        this._validateColumns();
        const columns = config?.columns;

        return columns.find(column => column?.identifier);
    }

    static getOperator(column) {
        const findColumnConfig = this.getColumns().find(columnConfig => columnConfig.column == column);

        return findColumnConfig?.metric;
    }

    static getPath() {
        const path = config?.path;

        if (!path) {
            throw new Error(`"${path}" is a invalid directory.`);
        }

        if (!fs.lstatSync(path).isDirectory()) {
            throw new Error(`"${path}" is not a valid directory.`);
        }

        return path;
    }

    static getStartLine() {
        return config.startLine;
    }

    static getSeparator() {
        return config.separator;
    }
}