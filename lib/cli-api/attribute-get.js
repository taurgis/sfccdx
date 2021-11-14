const fs = require('fs');
const path = require('path');
const cliUi = require('../cli-interface/ui');
const { SystemObjectDefinition } = require('../api/OCAPI');
const { mapFieldsToTable, ATTRIBUTES_SYSTEM_OBJECT } = require('../util/attributeMapping');
const { cleanOCAPIResponse } = require('../util/OCAPICleaner');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');

/**
 * Save the attribute definition to the data folder.
 *
 * @param {string} object The object to save the definition of
 * @param {string} attribute The attribute to save the definition of
 * @param {string} content The content to save
 */
function saveToFile(object, attribute, content) {
    const basePath = path.join(getBaseObjectMetadataPath(), object);

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(path.join(basePath, attribute + '.json'), JSON.stringify(cleanOCAPIResponse(content), null, 4));
}

/**
 * Get a single attribute definition of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the definition of
 * @param {string} attribute The attribute to get the definition of
 * @param {boolean} doNotSave Whether to block saving the definition to a file
 * @param {boolean} debug Whether to output debug information
 */
async function processSingleAttribute(systemObjectDefinition, object, attribute, doNotSave, debug) {
    const result = await systemObjectDefinition.getSingleObjectAttributeDefinition(object, attribute);

    if (result.isSuccess()) {
        if (debug) {
            cliUi.outputFields(
                mapFieldsToTable(result.data, ATTRIBUTES_SYSTEM_OBJECT),
                undefined,
            );
        }

        cliUi.outputSuccess(`${object}/${attribute} has been successfully retrieved!`);

        if (!doNotSave) {
            saveToFile(object, attribute, result.data);
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

    if (result.isSuccess()) {
        return result.data.data.filter((object) => {
            return object.object_type !== 'CustomObject';
        }).map(object => object.object_type);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    return [];
}

/**
 * Fetches a list of all attribute IDs of a given object.
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the attribute IDs of
 * @param {boolean} includeSystemAttributes Whether to include system attributes
 *
 * @returns Promise<string[]> The list of attribute IDs
 */
async function getAttributeIDsFromObject(systemObjectDefinition, object, includeSystemAttributes = false) {
    const result = await systemObjectDefinition.getObjectAttributeDefinitions(object);

    if (result.isSuccess()) {
        if (result.data.data) {
            return result.data.data.filter((attribute) => {
                return !attribute.system || includeSystemAttributes;
            }).map(attribute => attribute.id);
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    return [];
}

/**
 * Fetches attributes from objects through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributeGet(options) {
    try {
        cliUi.cliCommandBookend('attribute:get', 'Attempting to fetch field(s).');

        const systemObjectDefinition = new SystemObjectDefinition(options);

        const objectIDs = options.object ? [options.object] : await getObjectsIDs(systemObjectDefinition);

        for (const object of objectIDs) {
            const modifiedOptions = options;
            modifiedOptions.object = object;

            if (options.attribute) {
                await processSingleAttribute(
                    systemObjectDefinition, modifiedOptions.object, modifiedOptions.attribute, modifiedOptions.doNotSave, modifiedOptions.debug
                );
            } else {
                const resultingAttributeIDs = await getAttributeIDsFromObject(
                    systemObjectDefinition, modifiedOptions.object, modifiedOptions.includeSystemAttributes
                );

                for (const attributeID of resultingAttributeIDs) {
                    await processSingleAttribute(
                        systemObjectDefinition, modifiedOptions.object, attributeID, modifiedOptions.doNotSave, modifiedOptions.debug
                    );
                }
            }
        }

        cliUi.cliCommandBookend('attribute:get', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
};
