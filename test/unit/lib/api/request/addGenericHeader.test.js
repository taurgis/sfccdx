const addGenericHeader = require('../../../../../lib/api/request/addGenericHeader');
const expect = require('chai').expect;

describe('addGenericHeader', () => {
    it('Should add a generic header', () => {
        const request = {
            headers: {}
        };

        const headerName = 'headerName';
        const headerValue = 'headerValue';

        addGenericHeader(request, headerName, headerValue);

        expect(request.headers).to.have.property(headerName, headerValue);
    });

    it('Should throw an error when no request is passed', () => {
        expect(() => {
            addGenericHeader();
        }).to.throw(Error);
    });

    it('Should throw an error when no header name is passed', () => {
        expect(() => {
            addGenericHeader({});
        }).to.throw(Error);
    });

    it('Should throw an error when no header value is passed', () => {
        expect(() => {
            addGenericHeader({}, 'headerName');
        }).to.throw(Error);
    });
});