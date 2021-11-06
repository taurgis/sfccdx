// Initialize constants
const Table = require('cli-table');
const outputError = require('./outputError');

/**
 * @module _outputResults
 * @description Helper function to generate the results output via the CLI
 *
 * @param {Object} [results] Represents the roll-up summary object containing the results
 * @param {Object} [error] Represents the error object passed in the callback
 * @param {String} [tableConfigKey] Represents the key to get the table configs
 */
module.exports = (title, results, error) => {
    let table;

    // Were results provided?
    if (results) {
    // If not JSON operation mode, build a beautiful table to render within the console
        table = new Table({
            head: [title],
            colWidths: [119],
            colAligns: ['left'],
        });

        // Create the CLI table to display the results
        results.forEach((result) => {
            if (Array.isArray(result)) {
                table.push(result);
            } else {
                table.push(Object.keys(result).map((key) => (result[key] === undefined ? '-----' : result[key])));
            }
        });

        // Render the CLI table
        console.log(table.toString());
    }

    // Was an error presented?
    outputError(error);
};
