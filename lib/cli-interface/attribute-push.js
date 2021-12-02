const defaultOptions = require('./helpers/defaultOptions');
const { attributePush } = require('../cli-api');

/**
 * @function attribute:push
 * @description This function is used to push Object Meta Data to the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attribute:push command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attribute:push'))
        .requiredOption(
            '-o, --object <object>',
            'the Object to push the attribute to. (e.g. Profile, Product)',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'the attribute ID to push',
        )
        .option(
            '-f, --force-recreate',
            'force re-creation of the object (it will be removed from all attribute groups and delete all values on the records)',
            false,
        )
        .description('push a custom attribute to an object')
        .action(async (options) => {
            await attributePush(options);
        });

    return commandProgram;
};
