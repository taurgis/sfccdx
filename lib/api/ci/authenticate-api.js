const ccci = require('sfcc-ci');

/**
 * @function authenticate
 * @description Attempts to authenticate the SFCC-CI client to work against a given environment
 *
 * @param {Object} environment Represents the environment to be authenticated against
 * @returns {undefined}
 */
module.exports = (config) => new Promise((resolve, reject) => {
    ccci.auth.auth(config.clientid, config.clientsecret, (e, token) => {
    // Was an error caught?
        if (e) {
            reject(e);
        } else {
            // Execute the callback and pass-in the token
            resolve(token);
        }
    });
});
