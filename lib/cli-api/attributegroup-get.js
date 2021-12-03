const fs = require('fs');
const path = require('path');
const attributeMapping = require('../util/attributeMapping');
const OCAPICleaner = require('../util/OCAPICleaner');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');
const cliUi = require('../cli-interface/ui');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');

/**
 * Save the attribute definition to the data folder.
 *
 * @param {string} object The object to save the group of
 * @param {string} group The attribute group to save
 * @param {string} content The content to save
 */
function saveToFile(object, group, content) {
    const basePath = path.join(getBaseObjectMetadataPath(), object, 'groups');

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(path.join(basePath, `${group}.json`), JSON.stringify(OCAPICleaner.cleanOCAPIResponse(content), null, 4));
}

/**
 * Save the attribute definition to the data folder.
 *
 * @param {string} object The object to save the group assignments of
 * @param {string} group The attribute group to save the assignments of
 * @param {string} content The content to save
 */
function saveAssignedAttributesToFile(object, group, content) {
    const basePath = path.join(getBaseObjectMetadataPath(), object, 'groups');

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(path.join(basePath, `${group}-assignments.json`), JSON.stringify(content, null, 4));
}

/**
 * Get a single attribute group of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the definition of
 * @param {string} attributeGroup The attribute group to get
 * @param {boolean} doNotSave Whether to block saving the definition to a file
 * @param {boolean} debug Whether to output debug information
 */
async function processSingleGroup(systemObjectDefinition, object, attributeGroup, doNotSave, debug) {
    const result = await systemObjectDefinition.getAttributeGroupForObject(object, attributeGroup, false);

    if (result.isSuccess()) {
        if (debug) {
            cliUi.outputFields(
                attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_ATTRIBUTE_GROUP),
                undefined,
            );
        }

        cliUi.outputSuccess(`Fetching group ${attributeGroup} from ${object}.`);

        if (!doNotSave) {
            saveToFile(object, attributeGroup, result.data);

            const attributesResult = await systemObjectDefinition.getAttributeGroupForObject(object, attributeGroup, true);

            if (attributesResult.isSuccess() && attributesResult.data.attribute_definitions) {
                const attributesToSave = [];

                attributesResult.data.attribute_definitions.forEach((attribute) => {
                    attributesToSave.push(attribute.id);
                });

                saveAssignedAttributesToFile(object, attributeGroup, attributesToSave);
            }
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

/**
 * Fetches all of the existing system Object IDs from the OCAPI.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 *
 * @returns {Promise<string[]>} The list of system object IDs
 */
async function getObjectsIDs(systemObjectDefinition) {
    const result = await systemObjectDefinition.getSystemObjectDefinitions();
    const resultingIDs = [];

    if (result.isSuccess()) {
        result.data.data.forEach((object) => {
            if (object.object_type !== 'CustomObject') {
                resultingIDs.push(object.object_type);
            }
        });
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    return resultingIDs;
}

/**
 * Get all of the attribute groups of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the group IDs of
 *
 * @returns {Promise<string[]>} The list of attribute group IDs
 */
async function getAttributeGroupIDs(systemObjectDefinition, object) {
    const result = await systemObjectDefinition.getAttributeGroupsForObject(object);
    const resultingIDs = [];

    if (result.isSuccess()) {
        if (result.data.data) {
            result.data.data.forEach((object) => {
                resultingIDs.push(object.id);
            });
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    return resultingIDs;
}

/**
 * Gets an attribute group from an object through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributeGroupGet(options) {
    try {
        cliUi.cliCommandBookend('attributegroup:get', 'Attempting to fetch attribute group(s).');

        let objectIDs = [];
        const systemObjectDefinition = new SystemObjectDefinition(options);

        if (options.object) {
            objectIDs.push(options.object);
        } else {
            objectIDs = await getObjectsIDs(systemObjectDefinition);
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < objectIDs.length; i++) {
            const modifiedOptions = options;
            modifiedOptions.object = objectIDs[i];

            if (options.attributeGroup) {
                // eslint-disable-next-line no-await-in-loop
                await processSingleGroup(
                    systemObjectDefinition, modifiedOptions.object, modifiedOptions.attributeGroup, modifiedOptions.doNotSave, modifiedOptions.debug
                );
            } else {
                const attributeGroupIDs = await getAttributeGroupIDs(systemObjectDefinition, modifiedOptions.object);

                if (attributeGroupIDs.length > 0) {
                    for (let attributeGroupID of attributeGroupIDs) {
                        await processSingleGroup(
                            systemObjectDefinition, modifiedOptions.object, attributeGroupID, modifiedOptions.doNotSave, modifiedOptions.debug
                        );
                    };
                }
            }
        }

        cliUi.cliCommandBookend('attributegroup:get', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
}