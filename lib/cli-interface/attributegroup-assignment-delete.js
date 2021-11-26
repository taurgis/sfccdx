const defaultOptions = require('./helpers/defaultOptions');
const { attributeGroupAssignmentDelete } = require('../cli-api');

/**
 * @function attributegroup:assignment:delete
 * @description This function is used to delete an attribute group.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:assignment:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attributegroup:assignment:delete'))
        .requiredOption(
            '-o, --object <object>',
            'The Object to delete the assignment from. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to delete the assignment from.',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'The attribute assignment to delete.',
        )
        .option(
            '-p, --preserve-file',
            'Keep the associated file when deletion of the Attribute Group on the environment is successfull.',
            false,
        )
        .description('Delete a Attribute Group assignment.')
        .action(async (options) => {
            attributeGroupAssignmentDelete(options);
        });

    return commandProgram;
};
