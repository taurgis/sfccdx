const buildOCAPIUrl = require('../../../../../lib/api/request/buildOCAPIUrl');
const expect = require('chai').expect;

describe('buildOCAPIUrl', () => {
    it('should return the correct url for a data endpoint', () => {
        expect(buildOCAPIUrl('data', 'v21_10', '/<suffix>', true)).to.equal('/s/-/dw/data/v21_10/<suffix>');
    });

    it('should return the correct url for a data endpoint with a suffix', () => {
        expect(buildOCAPIUrl('data', 'v21_10', '/<suffix>', true, 'suffix')).to.equal('/s/-/dw/data/v21_10/<suffix>');
    });

    it('Should return the correct url for a shop endpoint', () => {
        expect(buildOCAPIUrl('shop', 'v21_10', '/<suffix>', true, 'RefArch')).to.equal('/s/RefArch/dw/shop/v21_10/<suffix>');
    });

    it('Should return the correct url for a shop endpoint, not taking into account the includeOrgPrefix parameter', () => {
        expect(buildOCAPIUrl('shop', 'v21_10', '/<suffix>', false, 'RefArch')).to.equal('/s/RefArch/dw/shop/v21_10/<suffix>');
    });

    it('Should throw an error for an unkown API type', () => {
        expect(() => {
            buildOCAPIUrl('unknown', 'v21_10', '/<suffix>', true, 'RefArch');
        }).to.throw(Error);
    });
});