const validate = require('validate.js');

const validateString = (stringValue, fieldName, minimumLength = 0) => {
    const result = {
        validationResult: true,
    };

    if (validate.isEmpty(stringValue)) {
        result.validationErrors = [`-- ${fieldName} should not be empty`];
        result.validationResult = false;

        return result;
    }

    if (!validate.isString(stringValue)) {
        result.validationErrors = [`-- ${fieldName} should be a string`];
        result.validationResult = false;

        return result;
    }

    if (stringValue.length < minimumLength) {
        result.validationErrors = [`-- ${fieldName} should be a at least ${minimumLength} characters long.`];
        result.validationResult = false;

        return result;
    }

    return result;
};

module.exports = function StringValidator(fieldName, minimumLength = 0) {
    return (stringValue) => validateString.apply(null, [stringValue, fieldName, minimumLength]);
};
