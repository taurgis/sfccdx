const addBearerToken = require('../../../../../lib/api/request/addBearerToken');
const expect = require('chai').expect;

describe('addBearerToken', () => {
    it('Should add bearer token to request', () => {
        const request = {
            headers: {},
        };
        const token = 'token';
        const result = addBearerToken(request, token);
        expect(result.headers.Authorization).to.equal(`Bearer ${token}`);
    });

    it('Should throw an error if no request is passed', () => {
        expect(() => {
            addBearerToken();
        }).to.throw(Error);
    });
});