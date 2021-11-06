// Initialize constants
const axios = require('axios');
const axiosRetry = require('axios-retry');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');

/**
 * @function initializeOCAPIRequest
 * @description Initializes a given OCAPI Request
 *
 * @param {String} hostname - The hostname of the OCAPI Server
 * @param {Boolean} disableRetry Describes whether the retry should be disabled (ex. for unit tests)
 * @return {AxiosInstance} Returns the base-request used to make OCAPI calls
 */
module.exports = (hostname, disableRetry = false) => {
    // Initialize local variables
    const totalRetryCount = 5;
    const retryDelay = 2000;
    const ERROR_500 = 500;

    // Create the axios instance
    /** type {AxiosInstance} * */
    const axiosClient = axios.create({
        baseURL: `https://${hostname}`,
        timeout: 10000,
        headers: {},
        responseType: 'json',
        responseEncoding: 'utf8',
        validateStatus(status) {
            return status < ERROR_500;
        },
    });

    // Evaluate if the retry should be disabled
    if (disableRetry === false) {
    // Initialize he retry configurations
        const retryConfig = {
            retries: totalRetryCount,
            shouldResetTimeout: true,
            retryDelay: (retryCount) => {
                // Output the retry-count in question
                console.log(`        -- Retrying request | attempt ${retryCount} of ${totalRetryCount}`.bold.red);

                // Return the retry-delay to employ
                return retryCount * retryDelay;
            },
            retryCondition: (error) => {
                // Output the error driving the retry
                console.log(`        -- ${error}`.bold.red);

                // Retry on all errors
                return true;
            },

        };

        // Configure the retry configuration
        axiosRetry(axiosClient, retryConfig);
    }

    // Return the client
    return axiosClient;
};
