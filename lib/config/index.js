const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

/**
 * Parses the dw.json file and returns the config object.
 *
 * @returns {object} The config object.
 */
function getDWJson() {
    let config = {};

    if (fs.existsSync(path.join(cwd, 'dw.json'))) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
        config = require(path.join(cwd, 'dw.json'));
    }

    return config;
}

/**
 * Parses the ocapi.json file and returns the config object.
 *
 * Note: If no ocapi.json file is found, the default 30x a client is used.
 *
 * @returns {object} The config object.
 */
function getOCAPIJson() {
    let config = {
        clientid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        clientpw: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    };

    if (fs.existsSync(path.join(cwd, 'ocapi.json'))) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
        config = require(path.join(cwd, 'ocapi.json'));
    }

    return config;
}

function loadConfig() {
    return { ...getDWJson(), ...getOCAPIJson() };
}

module.exports = loadConfig();
