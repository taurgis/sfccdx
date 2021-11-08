const config = require('../config');
const cliUi = require('./ui');
const B2CAuthenticate = require('../api/ci/authenticate-api');

/**
 * @function verify
 * @description This function is used to expose the complete runtimeEnvironment details to a CLI user.  Commands
 * are abstracted in this manner to facilitate unit testing of each command separately.
 *
 * @param {Object} commandProgram Represents the CLI program to which the getEnvironment command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    // Append the environment-get command to the parent program
    commandProgram
        .command('verify')
        .option(
            '-cid, --clientid <clientid>',
            'The OCAPI Client ID',
            config['client-id'],
        )
        .option(
            '-cs, --clientsecret <clientsecret>',
            'The OCAPI Client Secret',
            config['client-secret'],
        )
        .description('Verifies the B2C Commerce environment by making an authorization call.')
        .action(async (options) => {
            cliUi.cliCommandBookend('verify', 'Attempting to verify the B2C environment.');
            const authResult = await B2CAuthenticate(options);
            // Render the authentication details
            cliUi.outputResults(
                'OCAPI Token',
                [[authResult]],
                undefined,
            );
            cliUi.cliCommandBookend('verify', 'end');
        });

    // Return the program with the appended command
    return commandProgram;
};
