import fs from "node:fs";

import config from '../config.json' assert { type: "json" };
import { cwd } from "node:process";

export default class Config {
    static _validateColumns() {
        const columns = config?.columns;

        if (columns.length < 1) {
            throw new Error(`Propriedade "Columns" não possui nenhuma coluna.`);
        }

        const identifiers = columns.filter(column => column?.identifier);

        if (identifiers.length > 1) {
            throw new Error(`Existe mais de 1 identificador.`);
        }

        if (identifiers.length < 1) {
            throw new Error(`É obrigatório pelo menos 1 identificador.`);
        }

        const identifier = identifiers[0];
        if(!identifier?.format) {
            throw new Error(`Formato do identificador inválido.`);
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
        const path = config?.path.replace("{current}", cwd());

        if (!path) {
            throw new Error(`"${path}" é uma pasta inválida.`);
        }

        if (!fs.lstatSync(path).isDirectory()) {
            throw new Error(`"${path}" não é uma pasta.`);
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