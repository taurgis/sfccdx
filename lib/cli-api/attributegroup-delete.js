const path = require('path');
const cwd = process.cwd();
const fs = require('fs');
const cliUi = require('../cli-interface/ui');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');

/**
 * Delete a file.
 *
 * @param {string} object The object to delete the group from
 * @param {string} attributeGroup The group to delete the file of
 */
function deleteTheFile(object, attributeGroup) {
    const basePath = path.join(getBaseObjectMetadataPath(), object, 'groups', attributeGroup);

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
 * @param {string} attributeGroup The attribute group to delete
 * @param {boolean} preserveFile Whether or not to keep the associated file
 */
async function deleteSingleAttributeGroup(systemObjectDefinition, object, attributeGroup, preserveFile) {
    const result = await systemObjectDefinition.deleteAttributeGroupForObject(object, attributeGroup);

    if (result.isSuccess()) {
        cliUi.outputResults('Result', [[`Attribute Group ${attributeGroup} of ${object} deleted successfully.`]]);

        if (!preserveFile) {
            deleteTheFile(object, attributeGroup);
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

/**
 * Deletes an attribute group from an object through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributeGroupDelete(options) {
    try {
        cliUi.cliCommandBookend('attributegroup:delete', 'Attempting to delete a group.');

        const systemObjectDefinition = new SystemObjectDefinition(options);

        await deleteSingleAttributeGroup(systemObjectDefinition, options.object, options.attributeGroup, options.preserveFile);

        cliUi.cliCommandBookend('attributegroup:delete', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
}