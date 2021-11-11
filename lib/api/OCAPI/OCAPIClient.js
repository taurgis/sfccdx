const Request = require('../request');
const ccci = require('sfcc-ci');

class OCAPIClient {
    constructor(config) {
        if (!config) {
            throw new Error('No configuration provided');
        }

        this.config = config;
        this.basePath = '/';
        this.initializeClient();
    }

    /**
     * Fetches the OCAPI token from the server.
     *
     * @returns {Promise} A promise that resolves with the token.
     */
    getBearerToken() {
        return new Promise((resolve, reject) => {
            if (this.token) {
                resolve(this.token);
            };

            ccci.auth.auth(this.config.clientid, this.config.clientsecret, (e, token) => {
                // Was an error caught?
                if (e) {
                    reject(e);
                } else {
                    this.token = token;
                    // Execute the callback and pass-in the token
                    resolve(token);

                }
            });
        });
    }

    initializeClient() {
        this.requestInstance = Request.createRequestInstance(this.config.hostname);
    }

    async initializeRequestDefinition(endpoint) {
        if (!endpoint) {
            throw new Error('No endpoint provided');
        }

        return Request.createOCAPIDataRequestDef(endpoint, await this.getBearerToken());
    }
}

module.exports = OCAPIClient;