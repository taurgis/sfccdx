const createOCAPIDataRequestDef = require('../../../../../lib/api/request/createOCAPIDataRequestDef');
const expect = require('chai').expect;

describe('createOCAPIDataRequestDef', () => {
    it('Should return a valid OCAPI Data Request definition', () => {
        const requestDef = createOCAPIDataRequestDef('/<suffix>', '123456789');

        expect(requestDef).to.be.an('object');
        expect(requestDef).to.deep.equal({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 123456789',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
            url: '/s/-/dw/data/v21_10/<suffix>',
        });
    });

    it('Should return a valid OCAPI Data Request without the BM Site included', () => {
        const requestDef = createOCAPIDataRequestDef('/<suffix>', '123456789', false);

        expect(requestDef).to.be.an('object');
        expect(requestDef).to.deep.equal({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 123456789',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
            url: '/dw/data/v21_10/<suffix>',
        });
    });
});