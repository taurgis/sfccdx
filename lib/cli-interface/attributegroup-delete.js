const config = require('../config');
const cliUi = require('./ui');
const OCAPI = require('../api/ocapi');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const path = require('path');
const cwd = process.cwd();
const fs = require('fs');

/**
 * Delete a file.
 *
 * @param {string} object The object to delete the group from
 * @param {string} attributeGroup The group to delete the file of
 */
function deleteTheFile(object, attributeGroup) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions` +
        `${path.sep}${object}${path.sep}groups${path.sep + attributeGroup}`;
    const groupPath = basePath + '.json';
    const groupAssignmentsPath = basePath + '-assignments.json';

    if (fs.existsSync(groupPath)) {
        fs.unlinkSync(groupPath);
    }

    if (fs.existsSync(groupAssignmentsPath)) {
        fs.unlinkSync(groupAssignmentsPath);
    }
}

/**
 * Delete a signle attribute definition from an object

 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to delete the group from
 * @param {string} attribute The attribute group to delete
 * @param {boolean} preserveFile Whether or not to keep the associated file
 */
async function deleteSingleAttributeGroup(systemObjectDefinition, object, attributeGroup, preserveFile) {
    const result = await systemObjectDefinition.deleteAttributeGroupForObject(object, attributeGroup);

    if (result.isSuccess()) {
        cliUi.outputResults('Result', [[`Attribute Group ${attributeGroup} of ${object} deleted successfully.`]]);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    if (!preserveFile) {
        deleteTheFile(object, attributeGroup);
    }
}

/**
 * @function attributegroup:delete
 * @description This function is used to delete an attribute group.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    commandProgram
        .command('attributegroup:delete')
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
        .requiredOption(
            '-o, --object <object>',
            'The Object to delete the Attribute Group from. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to fetch information of. If no ID is passed, all Attribute Groups are fetched.',
        )
        .option(
            '-p, --preserve-file',
            'Keep the associated file when deletion of the Attribute Group on the environment is successfull.',
            false,
        )
        .description('Delete a Attribute Group from an object.')
        .action(async (options) => {
            try {
                cliUi.cliCommandBookend('attributegroup:delete', 'Attempting to delete a group.');

                const accessToken = await OCAPI.authenticate(options.clientid, options.clientsecret);
                const systemObjectDefinition = new OCAPI.SystemObjectDefinition({ 'hostname': options.hostname, 'token': accessToken });

                await deleteSingleAttributeGroup(systemObjectDefinition, options.object, options.attributeGroup, options.preserveFile);

                cliUi.cliCommandBookend('attributegroup:delete', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    return commandProgram;
};
