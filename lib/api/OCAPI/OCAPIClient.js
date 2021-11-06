const Request = require('../request');

class OCAPIClient {
    constructor(config) {
        this.config = config;
        this.basePath = '/';
        this.initializeClient();
    }

    initializeClient() {
        this.requestInstance = Request.createRequestInstance(this.config.hostname);
    }

    initializeRequestDefinition(endpoint) {
        return Request.createOCAPIDataRequestDef(endpoint, this.config.token);
    }
}

module.exports = OCAPIClient;