const path = require('path');
const fs = require('fs');
const cliUi = require('../cli-interface/ui');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
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
    const filePath = path.join(getBaseObjectMetadataPath(), object, 'groups', `${attributeGroup}-assignments.json`);

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
 * @param {boolean} debug Whether to output debug information
 */
async function pushSingleAttributeGroup(systemObjectDefinition, object, attributeGroup, forceRecreate, debug) {
    const getResult = await systemObjectDefinition.getAttributeGroupForObject(object, attributeGroup);
    const filePath = path.join(getBaseObjectMetadataPath(), object, 'groups', `${attributeGroup}.json`);

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

        if (debug) {
            cliUi.outputSuccess(`Attribute Group ${attributeGroup} updated.`);
        }
    } else {
        result = await systemObjectDefinition.createAttributeGroup(object, attributeGroup, body);

        if (debug) {
            cliUi.outputSuccess(`Attribute Group ${attributeGroup} (re)created.`);
        }
    }

    if (result.isSuccess()) {
        if (debug) {
            cliUi.outputFields(
                attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_ATTRIBUTE_GROUP),
                undefined,
            );
        }

        cliUi.outputSuccess(`Attribute Group ${attributeGroup} of ${object} pushed.`);

        await assignAttributesToGroup(systemObjectDefinition, object, attributeGroup);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

/**
 * Push Attribute Groups to objects through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributeGroupPush(options) {
    try {
        cliUi.cliCommandBookend('attributegroup:push', 'Attempting to push an Attribute Group.');

        const systemObjectDefinition = new SystemObjectDefinition(options);

        await pushSingleAttributeGroup(systemObjectDefinition, options.object, options.attributeGroup, options.forceRecreate, options.debug);

        cliUi.cliCommandBookend('attributegroup:push', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
};