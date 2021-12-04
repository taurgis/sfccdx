const defaultOptions = require('./helpers/defaultOptions');
const { attributeGroupPush } = require('../cli-api');

/**
 * @function attributegroup:push
 * @description This function is used to push Object Attribute Groups to the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:push command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attributegroup:push'))
        .requiredOption(
            '-o, --object <object>',
            'the Object to push the attribute to. (e.g. Profile, Product)',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to push.',
        )
        .option(
            '-f, --force-recreate',
            'force re-creation of the object (it will be removed from all attribute groups)',
            false,
        )
        .description('push a Attribute Group to an object')
        .action(async (options) => {
            await attributeGroupPush(options);
        });

    return commandProgram;
};
