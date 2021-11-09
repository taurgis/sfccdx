const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

let errorMock;
let tokenMock;

const config = {
    clientid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    clientsecret: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
};

const authenticateAPI = proxyquire('../../../../../lib/api/ci/authenticate-api', {
    "sfcc-ci": {
        auth: {
            auth: function (clientId, clientSecret, callback) {
                callback(errorMock, tokenMock);
            }
        }
    }
});

describe('SFCC-CI: Authentication', () => {
    beforeEach(() => {
        errorMock = null;
        tokenMock = null;
    });

    it('Should return an error if authentication fails.', async () => {
        errorMock = 'Error';

        try {
            await authenticateAPI(config);
            expect(false).to.be.true;
        } catch (e) {
            expect(e).to.equal(errorMock);
        }
    });

    it('Should return a token if there is no error.', async () => {
        tokenMock = 'sHLuOUiYpU4TwvZKhOb9AHfyGRc';

        const result = await authenticateAPI(config);
        expect(result).to.equal(tokenMock);
    });
});
