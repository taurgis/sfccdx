const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

let pathToUse;

describe('Config', () => {
    let config = proxyquire('../../../../lib/config', {
        'path': {
            join: () => {
                return pathToUse;
            }
        }
    });

    beforeEach(() => {
        pathToUse = path.join(cwd, 'dw.json');
    });

    it('It should return a config with the default API Client/Secret if no dw.json is present.', () => {
        pathToUse = 'IDONTEXIST';
        expect(config).to.deep.equal({
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
    });

    it('It should return a config based on dw.json if it is present.', () => {
        const exampleConfig ={
            hostname: 'devxx-eu01-project.demandware.net',
            username: 'user',
            password: 'password',
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        };

        if (fs.existsSync(pathToUse)) {
            fs.copyFileSync(pathToUse, pathToUse + '.bak');
        }

        fs.writeFileSync(pathToUse, JSON.stringify(exampleConfig));

        config = require('../../../../lib/config');

        if (fs.existsSync(pathToUse + '.bak')) {
            fs.copyFileSync(pathToUse + '.bak', pathToUse);
            fs.unlinkSync(pathToUse + '.bak');
        }

        expect(config).to.deep.equal(exampleConfig);
    });

    it('It should return a config with the fallback API data if it is not present in the dw.json.', () => {
        const exampleConfig ={
            hostname: 'devxx-eu01-project.demandware.net',
            username: 'user',
            password: 'password',
        };

        if (fs.existsSync(pathToUse)) {
            fs.copyFileSync(pathToUse, pathToUse + '.bak');
        }

        fs.writeFileSync(pathToUse, JSON.stringify(exampleConfig));

        config = require('../../../../lib/config');

        if (fs.existsSync(pathToUse + '.bak')) {
            fs.copyFileSync(pathToUse + '.bak', pathToUse);
            fs.unlinkSync(pathToUse + '.bak');
        }

        expect(config).to.deep.equal({
            ...exampleConfig,
            'client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'client-secret': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
    });
});