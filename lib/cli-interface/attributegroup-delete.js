const defaultOptions = require('./helpers/defaultOptions');
const { attributeGroupDelete } = require('../cli-api/index');

/**
 * @function attributegroup:delete
 * @description This function is used to delete an attribute group.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attributegroup:delete'))
        .requiredOption(
            '-o, --object <object>',
            'The Object to delete the Attribute Group from. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to delete.',
        )
        .option(
            '-p, --preserve-file',
            'Keep the associated file when deletion of the Attribute Group on the environment is successfull.',
            false,
        )
        .description('Delete a Attribute Group from an object.')
        .action(async (options) => {
            await attributeGroupDelete(options);
        });

    return commandProgram;
};
