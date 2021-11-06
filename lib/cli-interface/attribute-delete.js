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
 * @param {string} object The object to delete the definition from
 * @param {string} attribute The attribute to delete the definition of
 */
function deleteTheFile(object, attribute) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions${path.sep + object + path.sep + attribute}.json`;

    if (fs.existsSync(basePath)) {
        fs.unlinkSync(basePath);
    }
}

/**
 * Delete a signle attribute definition from an object

 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to delete the definition from
 * @param {string} attribute The attribute to delete the definition of
 * @param {boolean} preserveFile Whether or not to keep the associated file
 */
async function deleteSingleAttribute(systemObjectDefinition, object, attribute, preserveFile) {
    const result = await systemObjectDefinition.deleteSingleObjectAttributeDefinition(object, attribute);

    if (result.isSuccess()) {
        cliUi.outputResults('Result', [[`Attribute ${attribute} of ${object} deleted successfully`]]);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    if (!preserveFile) {
        deleteTheFile(object, attribute);
    }
}

/**
 * @function attribute:delete
 * @description This function is used to delete an attribute definition.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attribute:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    commandProgram
        .command('attribute:delete')
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
            'The Object to delete the attribute from. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'The attribute ID to delete.',
        )
        .option(
            '-p, --preserve-file',
            'Keep the associated file when deletion of the attribute on the environment is successfull.',
            false,
        )
        .description('Delete a custom attribute on an object.')
        .action(async (options) => {
            try {
                cliUi.cliCommandBookend('attribute:delete', 'Attempting to delete a field.');

                const accessToken = await OCAPI.authenticate(options.clientid, options.clientsecret);
                const systemObjectDefinition = new OCAPI.SystemObjectDefinition({ 'hostname': options.hostname, 'token': accessToken });

                await deleteSingleAttribute(systemObjectDefinition, options.object, options.attribute, options.preserveFile);

                cliUi.cliCommandBookend('attribute:delete', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    return commandProgram;
};
