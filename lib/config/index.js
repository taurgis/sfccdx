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

    if (!config['client-id']) {
        config['client-id'] = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    }

    if (!config['client-secret']) {
        config['client-secret'] = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    }

    return config;
}


function loadConfig() {
    return getDWJson();
}

module.exports = loadConfig();
