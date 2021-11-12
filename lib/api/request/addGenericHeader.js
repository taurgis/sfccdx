/**
 * @function addGenericHeader
 * @description Adds a generic header to the current request
 *
 * @param {Object} thisRequest Represents the current request being processed
 * @param {String} headerId Represents the identifier representing the header being added
 * @param {String} headerValue Represents the value being added to the header
 * @returns {Object} Returns the request with the generic header being added
 */
module.exports = (thisRequest, headerId, headerValue) => {
    if (!thisRequest) {
        throw new Error('Request is not defined.');
    }

    if (!headerId || !headerValue) {
        throw new Error('Header ID and Header Value are required.');
    }

    thisRequest.headers[headerId] = headerValue;
    // Return the request -- with the header appended
    return thisRequest;
};
