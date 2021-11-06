const Table = require('cli-table');

/**
 * @module outputSuccess
 * @description Helper function to generate the results output via the CLI
 *
 * @param {Object} message The success message to display
 */
module.exports = (message) => {
    if (message) {
        const table = new Table({
            head: ['Success Message'],
            colWidths: [120],
            colAligns: ['left'],
        });

        if (typeof message === 'object') {
            table.push([`${JSON.stringify(message, null, 2)}`]);
        } else {
            table.push([` -- ${message}`]);
        }

        console.log(table.toString());
    }
};
