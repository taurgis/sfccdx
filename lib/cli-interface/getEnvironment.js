const config = require('../config');
const cliUi = require('./ui');
const defaultOptions = require('./helpers/defaultOptions');

/**
 * @function getEnvironment
 * @description This function is used to expose the complete runtimeEnvironment details to a CLI user.  Commands
 * are abstracted in this manner to facilitate unit testing of each command separately.
 *
 * @param {Object} commandProgram Represents the CLI program to which the getEnvironment command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
*/
module.exports = (commandProgram) => {
    // Append the environment-get command to the parent program
    defaultOptions(commandProgram.command('environment'))
        .option(
            '-u, --username <username>',
            'your Business Manager Username',
            config.username,
        )
        .option(
            '-pw, --password <password>',
            'your Business Manager Password',
            config.password,
        )
        .description('attempts to read the current configuration either through the CLI, the'
            + ' dw.json & ocapi.json configuration file, or a combination (overriding the JSON via the CLI)')
        .action((options) => {
            cliUi.cliCommandBookend('environment', 'start');
            cliUi.outputConfig(options);
            cliUi.cliCommandBookend('environment', 'end');
        });

    // Return the program with the appended command
    return commandProgram;
};
