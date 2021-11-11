const path = require('path');
const fs = require('fs');
const cliUi = require('./ui');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const defaultOptions = require('./helpers/defaultOptions');
const cwd = process.cwd();
const attributeMapping = require('../util/attributeMapping');
const attributeDefinitionSample = require('../api/OCAPI/samples/AttributeDefenition.json');

/**
 * Pushes a single attribute definition of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to push the definition of
 * @param {string} attribute The attribute to push the definition of
 * @param {boolean} forceRecreate Whether to force the re-creation of the attribute (WARNING: This will remove the attribute from all attribute groups).
 * @param {boolean} debug Whether to output debug information
 */
async function pushSingleAttribute(systemObjectDefinition, object, attribute, forceRecreate, debug) {
    const getResult = await systemObjectDefinition.getSingleObjectAttributeDefinition(object, attribute);
    const filePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}${attribute}.json`;

    if (!fs.existsSync(filePath)) {
        attributeDefinitionSample.id = attribute;
        attributeDefinitionSample.display_name.default = attribute;

        fs.writeFileSync(filePath, JSON.stringify(attributeDefinitionSample, null, 4));

        cliUi.outputError(
            `Starting JSON file for attribute ${attribute} did not exist for object ${object}.\n\n` +
            `Created a sample file to start with on the correct location: \n` +
            `${filePath}\n\n` +
            `NOTE: Run the command "`.bold.red +
            `sfccdx attribute:get -o ${object} -a ${attribute} -s`.bold.blue +
            `" first if this attribute already exists.`.bold.red
        );
        return;
    }

    const body = fs.readFileSync(filePath);

    let result;

    if (getResult.isSuccess() && !forceRecreate) {
        // eslint-disable-next-line no-underscore-dangle
        result = await systemObjectDefinition.updateSingleObjectAttributeDefinition(object, attribute, getResult.data._resource_state, body);

        if (debug) {
            cliUi.outputSuccess(`Attribute ${attribute} should be updated.`);
        }
    } else {
        result = await systemObjectDefinition.createSingleObjectAttributeDefinition(object, attribute, body);

        if (debug) {
            cliUi.outputSuccess(`Attribute ${attribute} should be (re)created.`);
        }
    }

    if (result.isSuccess()) {
        if (debug) {
            cliUi.outputFields(
                attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_SYSTEM_OBJECT),
                undefined,
            );
        }

        cliUi.outputSuccess(`Attribute ${attribute} of object ${object} is pushed.`);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

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
            'The Object to push the attribute to. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'The attribute ID to push.',
        )
        .option(
            '-f, --force-recreate',
            'Force re-creation of the object (it will be removed from all attribute groups)',
            false,
        )
        .description('Push a custom attribute to an object.')
        .action(async (options) => {
            try {
                cliUi.cliCommandBookend('attribute:push', 'Attempting to push a field.');

                const systemObjectDefinition = new SystemObjectDefinition(options);

                await pushSingleAttribute(systemObjectDefinition, options.object, options.attribute, options.forceRecreate, options.debug);

                cliUi.cliCommandBookend('attribute:push', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    return commandProgram;
};
