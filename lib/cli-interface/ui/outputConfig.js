const Table = require('cli-table');
const validators = require('../../validators');

/**
 * @function outputEnvironmentDef
 * @description Output's the environment definition via the CLI
 *
 * @param {config} config Represents the configuration being rendered visually
 */
module.exports = (config) => {
    const table = new Table({
        head: ['Name', 'Is Valid', 'Configured Property Value'],
        colWidths: [30, 10, 77],
        colAligns: ['right', 'middle', 'left'],
    });

    const validationErrorTable = new Table({
        head: ['Env. Property Name', 'Validation Error(s) for Configured Values'],
        colWidths: [30, 88],
        colAligns: ['right', 'left'],
    });

    Object.keys(config).filter((key) => key !== 'operationMode').forEach((key) => {
        const validator = validators[key];

        if (validator) {
            const result = validator(config[key]);
            table.push([key, result.validationResult, config[key]]);

            if (!result.validationResult) {
                validationErrorTable.push([key, result.validationErrors]);
            }
        } else {
            table.push([key, '---', config[key]]);
        }
    });

    console.log(table.toString());

    if (validationErrorTable.length > 0) {
        console.log(validationErrorTable.toString());
    }
};
