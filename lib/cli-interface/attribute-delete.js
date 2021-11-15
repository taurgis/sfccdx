const defaultOptions = require('./helpers/defaultOptions');
const attributeDelete = require('../cli-api/attribute-delete');

/**
 * @function attribute:delete
 * @description This function is used to delete an attribute definition.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attribute:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attribute:delete'))
        .requiredOption(
            '-o, --object <object>',
            'the Object to delete the attribute from. (e.g. Profile, Product)',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'the attribute ID to delete',
        )
        .option(
            '-p, --preserve-file',
            'keep the associated file when deletion of the attribute on the environment is successful',
            false,
        )
        .description('delete a custom attribute on an object')
        .action(async (options) => {
            await attributeDelete(options);
        });

    return commandProgram;
};
