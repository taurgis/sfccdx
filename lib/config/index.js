const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

function getDWJson() {
  let config = {};

  if (fs.existsSync(path.join(cwd, 'dw.json'))) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    config = require(path.join(cwd, 'dw.json'));
  }

  return config;
}

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
