const path = require('path');
const fs = require('fs');
const cliUi = require('./ui');
const OCAPI = require('../api/ocapi');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const defaultOptions = require('./helpers/defaultOptions');
const cwd = process.cwd();
const attributeMapping = require('../util/attributeMapping');
const attributeDefinitionSample = require('../api/OCAPI/samples/AttributeGroup.json');

/**
 * Pushes a single attribute definition of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to push the definition of
 * @param {string} attributeGroup The Attribute Group to push
 */
async function assignAttributesToGroup(systemObjectDefinition, object, attributeGroup) {
    const filePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}` +
        `groups${path.sep + attributeGroup}-assignments.json`;

    if (fs.existsSync(filePath)) {
        const attributes = JSON.parse(fs.readFileSync(filePath));

        for (const attribute of attributes) {
            const result = await systemObjectDefinition.assignAttributeToGroup(object, attributeGroup, attribute);

            if (result.isSuccess()) {
                cliUi.outputSuccess(`Assigned ${attribute} to Attribute Group ${attributeGroup} of ${object}.`);
            } else {
                cliUi.outputError(result.getFaultMessage());
            }
        }
    }
}

/**
 * Pushes a single attribute definition of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to push the definition of
 * @param {string} attributeGroup The Attribute Group to push
 * @param {boolean} forceRecreate Whether to force the re-creation of the Attribute Group (WARNING: This will remove the attribute assignments).
 */
async function pushSingleAttributeGroup(systemObjectDefinition, object, attributeGroup, forceRecreate) {
    const getResult = await systemObjectDefinition.getAttributeGroupForObject(object, attributeGroup);
    const filePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}` +
        `groups${path.sep + attributeGroup}.json`;

    if (!fs.existsSync(filePath)) {
        attributeDefinitionSample.id = attributeGroup;
        attributeDefinitionSample.display_name.default = attributeGroup;

        fs.writeFileSync(filePath, JSON.stringify(attributeDefinitionSample, null, 4));

        cliUi.outputError(
            `Starting JSON file for Attribute Group ${attributeGroup} did not exist for object ${object}.\n\n` +
            `Created a sample file to start with on the correct location: \n` +
            `${filePath}\n\n` +
            `NOTE: Run the command "`.bold.red +
            `sfccdx attributegroup:get -o ${object} -g ${attributeGroup} -s`.bold.blue +
            `" first if this Attribute Group already exists.`.bold.red
        );
        return;
    }

    const body = fs.readFileSync(filePath);

    let result;

    if (getResult.isSuccess() && !forceRecreate) {
        // eslint-disable-next-line no-underscore-dangle
        result = await systemObjectDefinition.updateAttributeGroup(object, attributeGroup, getResult.data._resource_state, body);
        cliUi.outputSuccess(`Attribute Group ${attributeGroup} updated.`);
    } else {
        result = await systemObjectDefinition.createAttributeGroup(object, attributeGroup, body);
        cliUi.outputSuccess(`Attribute Group ${attributeGroup} (re)created.`);
    }

    if (result.isSuccess()) {
        cliUi.outputFields(
            attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_ATTRIBUTE_GROUP),
            undefined,
        );

        await assignAttributesToGroup(systemObjectDefinition, object, attributeGroup);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

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
            'The Object to push the attribute to. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to push.',
        )
        .option(
            '-f, --force-recreate',
            'Force re-creation of the object (it will be removed from all attribute groups)',
            false,
        )
        .description('Push a Attribute Group to an object.')
        .action(async (options) => {
            try {
                cliUi.cliCommandBookend('attributegroup:push', 'Attempting to push an Attribute Group.');

                const accessToken = await OCAPI.authenticate(options.clientid, options.clientsecret);
                const systemObjectDefinition = new OCAPI.SystemObjectDefinition({ 'hostname': options.hostname, 'token': accessToken });

                await pushSingleAttributeGroup(systemObjectDefinition, options.object, options.attributeGroup, options.forceRecreate);

                cliUi.cliCommandBookend('attributegroup:push', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    return commandProgram;
};
