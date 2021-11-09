const path = require('path');

/**
 * Get the path where all System Object data is stored.
 *
 * @return {string} The path where all System Object data is stored.
 */
function getBaseObjectMetadataPath() {
    return path.join(process.cwd(), 'data', 'meta', 'system-objecttype-extensions');
}

module.exports = {
    getBaseObjectMetadataPath
}
