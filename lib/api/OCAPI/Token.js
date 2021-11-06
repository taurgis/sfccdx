const ccci = require('sfcc-ci');

/**
 * Fetches the OCAPI token from the server.
 *
 * @param {string} clientid The client id.
 * @param {string} clientsecret The client secret.
 *
 * @returns {Promise} A promise that resolves with the token.
 */
class Token {
    static get(clientid, clientsecret) {
        return new Promise((resolve, reject) => {
            ccci.auth.auth(clientid, clientsecret, (e, token) => {
                // Was an error caught?
                if (e) {
                    reject(e);
                } else {
                    // Execute the callback and pass-in the token
                    resolve(token);
                }
            });
        });
    }
}

module.exports = Token;