const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

let pathToUse;
let dwJSON = {};

describe('Config', () => {
    let config;

    beforeEach(() => {
        pathToUse = path.join(cwd, 'dw.json');
    });

    it('It should return a config with the default API Client/Secret if no dw.json is present.', () => {
        pathToUse = 'IDONTEXIST';

        const proxyQuireStubs = {
            'path': {
                join: () => {
                    return pathToUse;
                }
            }
        };

        config = proxyquire('../../../../lib/config', proxyQuireStubs);


        expect(config).to.deep.equal({
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
    });

    it('It should return a config based on dw.json if it is present.', () => {
        dwJSON = {
            hostname: 'devxx-eu01-project.demandware.net',
            username: 'user',
            password: 'password',
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        };

        const proxyQuireStubs = {
            'path': {
                join: () => {
                    return pathToUse;
                }
            }
        };

        proxyQuireStubs[pathToUse] = dwJSON;

        config = proxyquire('../../../../lib/config', proxyQuireStubs);

        expect(config).to.deep.equal(dwJSON);
    });

    it('It should return a config with the fallback API data if it is not present in the dw.json.', () => {
        dwJSON = {
            hostname: 'devxx-eu01-project.demandware.net',
            username: 'user',
            password: 'password',
        };

        const proxyQuireStubs = {
            'path': {
                join: () => {
                    return pathToUse;
                }
            }
        };

        proxyQuireStubs[pathToUse] = dwJSON;

        config = proxyquire('../../../../lib/config', proxyQuireStubs);

        expect(config).to.deep.equal({
            ...dwJSON,
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
    });
});
