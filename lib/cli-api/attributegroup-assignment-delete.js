const path = require('path');
const fs = require('fs');
const cliUi = require('../cli-interface/ui');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');

/**
 * Delete a file.
 *
 * @param {string} object The object to delete the group from
 * @param {string} attributeGroup The group to delete the file of
 * @param {string} attribute The attribute to delete from the file if it exists
 */
function deleteFromTheFile(object, attributeGroup, attribute) {
    const groupAssignmentsPath = path.join(getBaseObjectMetadataPath(), object, 'groups', `${attributeGroup}-assignments.json`)

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
 * Deletes an attribute assignment to a group from objects through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributegroupAssignmentDelete(options) {
    try {
        cliUi.cliCommandBookend('attributegroup:assignment:delete', 'Attempting to delete a assignment to a attribute group.');

        const systemObjectDefinition = new SystemObjectDefinition(options);

        await deleteSingleAttributeGroupAssignment(
            systemObjectDefinition, options.object, options.attributeGroup, options.attribute, options.preserveFile
        );

        cliUi.cliCommandBookend('attributegroup:assignment:delete', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
};