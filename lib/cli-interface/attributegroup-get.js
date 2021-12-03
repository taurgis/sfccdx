const cliUi = require('./ui');
const defaultOptions = require('./helpers/defaultOptions');
const { attributeGroupGet } = require('../cli-api');

/**
 * @function attributegroup:get
 * @description This function is used fetch an Object Attribute Group from the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:get command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attributegroup:get'))
        .option(
            '-dns, --do-not-save',
            'prevent saving the Attribute Group to the data folder',
            false,
        )
        .option(
            '-o, --object <object>',
            'the Object to get the attribute group(s) from. (e.g. Profile, Product). If no value is passed, all objects are fetched',
        )
        .option(
            '-g, --attribute-group <attributeGroup>',
            'the Attribute Group ID to fetch information of. If no ID is passed, all Attribute Groups are fetched',
        )
        .description('fetch all information about a given Attribute Group')
        .action(async (options) => {
            if (options.attributeGroup && !options.object) {
                cliUi.outputError('You must specify an object to get the attribute from.'.bold.red);

                return;
            }

            attributeGroupGet(options);
        });

    // Return the program with the appended command
    return commandProgram;
};
