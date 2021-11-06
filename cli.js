#!/usr/bin/env node

let program = require('commander');
const PackageConfig = require('./package.json');
const cliInterface = require('./lib/cli-interface');

const projectVersionNo = PackageConfig.version;

/**
 * @typedef {Object} commandObj
 * @description Represents a roll-up of the CLI command object and its arguments
 *
 */

// Initialize the version of the CLI program
program.version(projectVersionNo);

//------------------------------------------------
// Initialize CLI commands
//------------------------------------------------

// Attach the command used to retrieve the complete environment details
program = cliInterface.getEnvironment(program);
program = cliInterface.verify(program);
program = cliInterface.attributeGet(program);
program = cliInterface.attributeDelete(program);
program = cliInterface.attributePush(program);
program = cliInterface.attributeGroupGet(program);

program.parse(process.argv);
