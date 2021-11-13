// Initialize local libraries
const buildOCAPIUrl = require('./buildOCAPIUrl');
const addBearerToken = require('./addBearerToken');
const addGenericHeader = require('./addGenericHeader');

/**
 * @function _createOCAPIDataRequestDef
 * @description Helper function to create a stubbed-out OCAPI data-definition request
 *
 * @param {String} ocapiUrlSuffix Represents the OCAPI Data API Url suffix
 * @param {String} accessToken Represents the access token used to auth this request
 * @param {Boolean} [includeBMSite] Describes if the Business Manager site should be included in the url
 * @return {Object} Returns an instance of the request definition object leveraged by axios
 */
module.exports = (ocapiUrlSuffix, accessToken, includeBMSite = true) => {
    let output = {
        url: buildOCAPIUrl('data', 'v21_10', ocapiUrlSuffix, includeBMSite),
        headers: {},
    };

    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    };

    Object.keys(headers).forEach((header) => addGenericHeader(output, header, headers[header]));

    output = addBearerToken(output, accessToken);

    return output;
};
