// Initialize constants
const Table = require('cli-table');
/**
 * @module _outputResults
 * @description Helper function to generate the results output via the CLI
 *
 * @param {Object} error Represents the error object passed in the callback
 */
module.exports = (error) => {
    if (error) {
        if (error.stack === undefined) {
            const table = new Table({
                head: ['Error Message'],
                colWidths: [120],
                colAligns: ['left'],
            });

            if (typeof error === 'object') {
                table.push([`${JSON.stringify(error, null, 2)}`]);
            } else {
                table.push([` -- ${error}`]);
            }

            console.log(table.toString());
        } else {
            // Output the error message details
            console.log('----------------------------------------------------------------------------');
            console.log(' Error Message: StackTrace: START');
            console.log('----------------------------------------------------------------------------');
            console.log(error.stack);
            console.log('----------------------------------------------------------------------------');
            console.log(' Error Message: StackTrace: END');
            console.log('----------------------------------------------------------------------------');
        }
    }
};
