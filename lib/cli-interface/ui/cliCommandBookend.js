const PackageConfig = require('../../../package.json');
const outputConfig = require('./outputConfig');

/**
 * @function _cliCommandBookend
 * @description This function is used to generate the CLI command visual bookend that
 * outlines the command execution via the CLI
 *
 * @param {String} commandDescription Describes the name of the command being executed
 * @param {String} bookendType Describes the bookendType (start or end)
 * @param {String} [message] Represents the opening message to display
 * @param {Object} [config] Represents the environment configuration to use
 */
module.exports = (commandDescription, bookendType, message, config) => {
    // Output the bookend display to the console
    console.log('----------------------------------------------------------------------------');
    console.log(` FWD-CLI | v${PackageConfig.version} | ${commandDescription}: ${bookendType.toUpperCase()}`);
    console.log('----------------------------------------------------------------------------');

    // Output the opening message if it's defined
    if (message !== undefined) { console.log(` -- ${message}`); }

    // Output the environment details -- if they're provided
    if (config !== undefined) { outputConfig(config); }
};
