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
 * @param {string} object The object to save the group of
 * @param {string} group The attribute group to save
 * @param {string} content The content to save
 */
function saveToFile(object, group, content) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}groups${path.sep}`;

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(`${basePath + group}.json`, JSON.stringify(OCAPICleaner.cleanOCAPIResponse(content), null, 4));
}

/**
 * Save the attribute definition to the data folder.
 *
 * @param {string} object The object to save the group assignments of
 * @param {string} group The attribute group to save the assignments of
 * @param {string} content The content to save
 */
function saveAssignedAttributesToFile(object, group, content) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep}${object}${path.sep}groups${path.sep}`;

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(`${basePath + group}-assignments.json`, JSON.stringify(OCAPICleaner.cleanOCAPIResponse(content), null, 4));
}

/**
 * Get a single attribute group of an object.
 *
 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to get the definition of
 * @param {string} attributeGroup The attribute group to get
 * @param {boolean} doNotSave Whether to block saving the definition to a file
 */
async function processSingleGroup(systemObjectDefinition, object, attributeGroup, doNotSave) {
    const result = await systemObjectDefinition.getAttributeGroupForObject(object, attributeGroup, false);

    if (result.isSuccess()) {
        cliUi.outputFields(
            attributeMapping.mapFieldsToTable(result.data, attributeMapping.ATTRIBUTES_ATTRIBUTE_GROUP),
            undefined,
        );

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
 * @function attributegroup:get
 * @description This function is used fetch an Object Attribute Group from the configured instance.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:get command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    commandProgram
        .command('attributegroup:get')
        .option(
            '-h, --hostname <hostname>',
            'Your Instance Hostname',
            config.hostname,
        )
        .option(
            '-cid, --clientid <clientid>',
            'The OCAPI Client ID',
            config.clientid,
        )
        .option(
            '-cs, --clientsecret <clientsecret>',
            'The OCAPI Client Secret',
            config.clientsecret,
        )
        .option(
            '-dns, --do-not-save',
            'Prevent saving the Attribute Group to the data folder.',
            false,
        )
        .option(
            '-o, --object <object>',
            'The Object to get the attribute group(s) from. (e.g. Profile, Product). If no value is passed, all objects are fetched.',
        )
        .option(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to fetch information of. If no ID is passed, all Attribute Groups are fetched.',
        )
        .description('Fetch all information about a given Attribute Group.')
        .action(async (options) => {
            if (options.attributeGroup && !options.object) {
                cliUi.outputError('You must specify an object to get the attribute from.'.bold.red);

                return;
            }

            try {
                cliUi.cliCommandBookend('attributegroup:get', 'Attempting to fetch attribute group(s).');

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

                    if (options.attributeGroup) {
                    // eslint-disable-next-line no-await-in-loop
                        await processSingleGroup(
                            systemObjectDefinition, modifiedOptions.object, modifiedOptions.attributeGroup, modifiedOptions.doNotSave,
                        );
                    } else {
                        const attributeGroupIDs = await getAttributeGroupIDs(systemObjectDefinition, modifiedOptions.object);

                        if (attributeGroupIDs.length > 0) {
                            for (let attributeGroupID of attributeGroupIDs) {
                                await processSingleGroup(systemObjectDefinition, modifiedOptions.object, attributeGroupID, modifiedOptions.doNotSave);
                            };
                        }
                    }
                }

                cliUi.cliCommandBookend('attributegroup:get', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    // Return the program with the appended command
    return commandProgram;
};
