const createRequestInstance = require('../../../../../lib/api/request/createRequestInstance');
const expect = require('chai').expect;

describe('createRequestInstance', () => {
    it('should create a request instance', () => {
        const request = createRequestInstance('baseurl.com');

        expect(request.defaults.baseURL).to.equal('https://baseurl.com');
        expect(request.defaults.timeout).to.equal(10000);
        expect(request.defaults.responseType).to.equal('json');
        expect(request.defaults.responseEncoding).to.equal('utf8');
    });
});