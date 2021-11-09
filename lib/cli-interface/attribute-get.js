const defaultOptions = require('./helpers/defaultOptions');
const { attributeGet } = require('../cli-api');
const { outputError } = require('../cli-interface/ui');

/**
 * @function attribute:get
 * @description This function is used fetch Object Meta Data from the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attribute:get command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    defaultOptions(commandProgram.command('attribute:get'))
        .option(
            '-dns, --do-not-save',
            'Prevent saving the attribute definition to the data folder.',
            false,
        )
        .option(
            '-o, --object <object>',
            'The Object to get the attribute from. (e.g. Profile, Product). If no value is passed, all objects are fetched.',
        )
        .option(
            '-a, --attribute <attribute>',
            'The attribute ID to fetch information of. If no ID is passed, all attributes are fetched.',
        )
        .option(
            '-isa, --include-system-attributes',
            'When fetching all attributes from an object, include system attributes.',
            false,
        )
        .description('Fetch all information about a given standard or custom attribute.')
        .action(async (options) => {
            if (options.attribute && !options.object) {
                outputError('You must specify an object to get the attribute from.'.bold.red);

                return;
            }

            await attributeGet(options);
        });

    return commandProgram;
};
