const cliUi = require('../cli-interface/ui');
const SystemObjectDefinition = require('../api/OCAPI/SystemObjectDefinition');
const path = require('path');
const fs = require('fs');
const { getBaseObjectMetadataPath } = require('./helpers/pathHelper');

/**
 * Delete a file.
 *
 * @param {string} object The object to delete the definition from
 * @param {string} attribute The attribute to delete the definition of
 */
function deleteTheFile(object, attribute) {
    const basePath = path.join(getBaseObjectMetadataPath(), object, `${attribute}.json`);

    if (fs.existsSync(basePath)) {
        fs.unlinkSync(basePath);
    }
}

/**
 * Delete a single attribute definition from an object

 * @param {SystemObjectDefinition} systemObjectDefinition The SystemObjectDefinition API
 * @param {string} object The object to delete the definition from
 * @param {string} attribute The attribute to delete the definition of
 * @param {boolean} preserveFile Whether or not to keep the associated file
 */
async function deleteSingleAttribute(systemObjectDefinition, object, attribute, preserveFile) {
    const result = await systemObjectDefinition.deleteSingleObjectAttributeDefinition(object, attribute);

    if (result.isSuccess()) {
        cliUi.outputSuccess(`Attribute ${attribute} of ${object} deleted successfully.`);

        if (!preserveFile) {
            deleteTheFile(object, attribute);
        }
    } else {
        cliUi.outputError(result.getFaultMessage());
    }
}

/**
 * Deletes attributes from objects through the OCAPI
 *
 * @param options {Object} The options to use
 */
module.exports = async function attributeDelete(options) {
    try {
        cliUi.cliCommandBookend('attribute:delete', 'Attempting to delete a field.');

        const systemObjectDefinition = new SystemObjectDefinition(options);

        await deleteSingleAttribute(systemObjectDefinition, options.object, options.attribute, options.preserveFile);

        cliUi.cliCommandBookend('attribute:delete', 'end');
    } catch (error) {
        cliUi.outputError(error.stack.bold.red);
    }
};
