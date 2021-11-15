const config = require('../../config');

/**
 * Set up the default parameters for each command (or most) of the CLI.
 *
 * @param {object} command - The command
 *
 * @returns {object} - The command with the added default options
 */
function addDefaultOptions(command) {
    return command.option(
        '-h, --hostname <hostname>',
        'your Instance Hostname',
        config.hostname,
    ).option(
        '-cid, --clientid <clientid>',
        'the OCAPI Client ID',
        config['client-id'],
    ).option(
        '-cs, --clientsecret <clientsecret>',
        'the OCAPI Client Secret',
        config['client-secret'],
    ).option(
        '-d, --debug',
        'when passed extra debug output is provided',
        false
    )
}

module.exports = addDefaultOptions
