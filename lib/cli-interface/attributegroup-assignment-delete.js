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
 * @param {string} attribute The attribute to delete from the file if it exists
 */
function deleteFromTheFile(object, attributeGroup, attribute) {
    const basePath = `${cwd}${path.sep}data${path.sep}meta${path.sep}system-objecttype-extensions` +
        `${path.sep}${object}${path.sep}groups${path.sep + attributeGroup}`;
    const groupAssignmentsPath = basePath + '-assignments.json';

    if (fs.existsSync(groupAssignmentsPath)) {
        /**
         * @type {Array<string>}
         */
        const attributeIds = JSON.parse(fs.readFileSync(groupAssignmentsPath));

        fs.writeFileSync(groupAssignmentsPath, JSON.stringify(attributeIds.filter(attributeId => attributeId != attribute), null, 4));
    }
}

/**
 * Delete a signle assignment to atribute group

 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to delete the assignment from
 * @param {string} attributeGroup The attribute group
 * @param {string} attribute The attribute assignment to delete
 * @param {boolean} preserveFile Whether or not to keep the associated assignment in the file
 */
async function deleteSingleAttributeGroupAssignment(systemObjectDefinition, object, attributeGroup, attribute, preserveFile) {
    const result = await systemObjectDefinition.deleteAssignmentToAttributeToGroup(object, attributeGroup, attribute);

    if (result.isSuccess()) {
        cliUi.outputResults('Result', [[`Attribute ${attribute} has been un-assigned from Group ${attributeGroup} of ${object} successfully.`]]);
    } else {
        cliUi.outputError(result.getFaultMessage());
    }

    if (!preserveFile) {
        deleteFromTheFile(object, attributeGroup, attribute);
    }
}

/**
 * @function attributegroup:assignment:delete
 * @description This function is used to delete an attribute group.
 *
 * @param {Object} commandProgram Represents the CLI program to which the attributegroup:assignment:delete command is appended
 * @return {Object} Returns the updated commandProgram -- including the command that was just attached
 */
module.exports = (commandProgram) => {
    commandProgram
        .command('attributegroup:assignment:delete')
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
            'The Object to delete the assignment from. (e.g. Profile, Product).',
        )
        .requiredOption(
            '-g, --attribute-group <attributeGroup>',
            'The Attribute Group ID to delete the assignment from.',
        )
        .requiredOption(
            '-a, --attribute <attribute>',
            'The attribute assignment to delete.',
        )
        .option(
            '-p, --preserve-file',
            'Keep the associated file when deletion of the Attribute Group on the environment is successfull.',
            false,
        )
        .description('Delete a Attribute Group from an object.')
        .action(async (options) => {
            try {
                cliUi.cliCommandBookend('attributegroup:assignment:delete', 'Attempting to delete a assignment to a attribute group.');

                const accessToken = await OCAPI.authenticate(options.clientid, options.clientsecret);
                const systemObjectDefinition = new OCAPI.SystemObjectDefinition({ 'hostname': options.hostname, 'token': accessToken });

                await deleteSingleAttributeGroupAssignment(
                    systemObjectDefinition, options.object, options.attributeGroup, options.attribute, options.preserveFile
                );

                cliUi.cliCommandBookend('attributegroup:assignment:delete', 'end');
            } catch (error) {
                cliUi.outputError(error.stack.bold.red);
            }
        });

    return commandProgram;
};
