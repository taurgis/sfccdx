const validate = require('validate.js');
const validator = require('validator');

module.exports = (hostname) => {
    const result = {
        validationResult: true,
    };

    if (validate.isEmpty(hostname)) {
        result.validationErrors = ['-- hostname should not be null or undefined'];
        result.validationResult = false;

        return result;
    }

    if (validator.isURL(hostname, {
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https'],
    })) {
        result.validationErrors = ['-- hostnames should not begin with protocol declarations (ex. https://)'];
        result.validationResult = false;

        return result;
    }

    return result;
};
