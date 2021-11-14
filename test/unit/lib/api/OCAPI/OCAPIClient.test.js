const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

let errorMock;
let tokenMock;

const config = {
    host: 'https://devxx-eu01-project.demandware.net',
    clientid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    clientsecret: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
};

const OCAPIClient = proxyquire('../../../../../lib/api/OCAPI/OCAPIClient', {
    "sfcc-ci": {
        auth: {
            auth: function (clientId, clientSecret, callback) {
                callback(errorMock, tokenMock);
            }
        }
    }
});

describe('OCAPIClient', () => {
    describe ('Constructor', () => {
        it('Should create a new OCAPIClient', () => {
            const client = new OCAPIClient(config);

            expect(client).to.be.an.instanceof(OCAPIClient);
        });

        it('Should throw an exception if no configuration is passed', () => {
            try {
                const client = new OCAPIClient();
                expect(true).to.be.false;
            } catch (e) {
                // Do nothing
            }
        });

        it('Should store the passed config', () => {
            const client = new OCAPIClient(config);

            expect(client.config).to.deep.equal(config);
        });

        it('Should set a base path', () => {
            const client = new OCAPIClient(config);

            expect(client.basePath).to.deep.equal('/');
        });

        it('Should initialize the client', () => {
            const client = new OCAPIClient(config);

            expect(client.requestInstance).to.not.be.null;
        });
    });

    describe('getBearerToken', () => {
        beforeEach(() => {
            errorMock = null;
            tokenMock = null;
        });

        it('Should return an error if authentication fails.', async () => {
            errorMock = 'Error';

            try {
                await new OCAPIClient(config).getBearerToken();
                expect(false).to.be.true;
            } catch (e) {
                expect(e).to.equal(errorMock);
            }
        });

        it('Should return a token if there is no error.', async () => {
            tokenMock = 'sHLuOUiYpU4TwvZKhOb9AHfyGRc';

            const result = await new OCAPIClient(config).getBearerToken();
            expect(result).to.equal(tokenMock);
        });
    });

    describe('initializeRequestDefinition', () => {

        beforeEach(() => {
            tokenMock = 'sHLuOUiYpU4TwvZKhOb9AHfyGRc';
        });

        it('Should return the request definition', async () => {
            const client = new OCAPIClient(config);
            const requestDefinition = await client.initializeRequestDefinition('/test');

            expect(requestDefinition).to.deep.equal({
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Authorization': 'Bearer ' + tokenMock
                },
                'url': '/s/-/dw/data/v21_10/test',
            });
        });

        it('Should throw an error if no endpoint is provided', () => {
            return new OCAPIClient(config).initializeRequestDefinition().catch(error => {
                expect(error.message).to.equal('No endpoint provided');
            });
        })
    });
});
