const fs = require('fs');
const path = require('path');
const config = require('../config');
const cliUi = require('./ui');
const OCAPI = require('../api/OCAPI');
const attributeMapping = require('../util/attributeMapping');
const OCAPICleaner = require('../util/OCAPICleaner');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const cwd = process.cwd();

/**
 * Save the attribute definition to the data folder.
 *
 * @param {string} object The object to save the definition of
 * @param {string} attribute The attribute to save the definition of
 * @param {string} content The content to save
 */
function saveToFile(object, attribute, content) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}`;

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(`${basePath + attribute}.json`, JSON.stringify(OCAPICleaner.cleanOCAPIResponse(content), null, 4));
}

/**
 * Get a single attribute definition of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the definition of
 * @param {string} attribute The attribute to get the definition of
 * @param {boolean} doNotSave Whether to block saving the definition to a file
 */
async function processSingleAttribute(systemObjectDefinition, object, attribute, doNotSave) {
    const result = await systemObjectDefinition.getSingleObjectAttributeDefinition(object, attribute);

    if (result.isSuccess()) {
        cliUi.outputFields(
            attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_SYSTEM_OBJECT),
            undefined,
        );

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
 * Fetches a list of all attribute IDs of a given object.
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the attribute IDs of
 * @param {boolean} includeSystemAttributes Whether to include system attributes
 *
 * @returns Promise<string[]> The list of attribute IDs
 */
async function getAttributeIDsFromObject(systemObjectDefinition, object, includeSystemAttributes) {
    const result = await systemObjectDefinition.getObjectAttributeDefinitions(object);
    const resultingIDs = [];

    if (result.isSuccess()) {
        if (result.data.data) {
            result.data.data.forEach((attribute) => {
                if (attribute.system && !includeSystemAttributes) {
                    return;
                }

                resultingIDs.push(attribute.id);
            });
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    return resultingIDs;
}

/**
 * @function attribute:get
 * @description This function is used fetch Object Meta Data from the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attribute:get command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    commandProgram
        .command('attribute:get')
        .option(
            '-h, --hostname <hostname>',
            'Your Instance Hostname',
            config.hostname,
        )
        .option(
            '-cid, --clientid <clientid>',
            'The OCAPI Client ID',
            config['client-id'],
        )
        .option(
            '-cs, --clientsecret <clientsecret>',
            'The OCAPI Client Secret',
            config['client-secret'],
        )
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
                cliUi.outputError('You must specify an object to get the attribute from.'.bold.red);

                return;
            }

            try {
                cliUi.cliCommandBookend('attribute:get', 'Attempting to fetch field(s).');

                const accessToken = await OCAPI.authenticate(options.clientid, options.clientsecret);
                const systemObjectDefinition = new OCAPI.SystemObjectDefinition({ 'hostname': options.hostname, 'token': accessToken });

                let objectIDs = [];

                if (options.object) {
                    objectIDs.push(options.object);
                } else {
                    objectIDs = await getObjectsIDs(systemObjectDefinition);
                }

                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < objectIDs.length; i++) {
                    const modifiedOptions = options;
                    modifiedOptions.object = objectIDs[i];

                    if (options.attribute) {
                    // eslint-disable-next-line no-await-in-loop
                        await processSingleAttribute(
                            systemObjectDefinition, modifiedOptions.object, modifiedOptions.attribute, modifiedOptions.doNotSave
                        );
                    } else {
                    // eslint-disable-next-line no-await-in-loop
                        const resultingAttributeIDs = await getAttributeIDsFromObject(
                            systemObjectDefinition, modifiedOptions.object, modifiedOptions.includeSystemAttributes
                        );

                        // eslint-disable-next-line no-restricted-syntax
                        for (const attributeID of resultingAttributeIDs) {
                        // eslint-disable-next-line no-await-in-loop
                            await processSingleAttribute(systemObjectDefinition, modifiedOptions.object, attributeID, modifiedOptions.doNotSave);
                        }
                    }
                }

                cliUi.cliCommandBookend('attribute:get', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    // Return the program with the appended command
    return commandProgram;
};
