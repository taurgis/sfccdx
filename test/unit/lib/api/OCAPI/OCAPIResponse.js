const expect = require('chai').expect;
const OCAPIResponse = require('../../../../../lib/api/OCAPI/OCAPIResponse');

describe('OCAPIResponse', () => {
    describe ('Constructor', () => {
        it('Should create a new OCAPIResponse object', () => {
            const response = new OCAPIResponse({});

            expect(response).to.be.an.instanceof(OCAPIResponse);
        });

        it('Should create a new OCAPIResponse based on the request response', () => {
            const response = new OCAPIResponse({
                status: 200,
                data: {
                    foo: 'bar'
                }
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({ foo: 'bar' });
        });

        it('Should throw an exception if no reponse is passed.', () => {
            expect(() => {
                new OCAPIResponse();
            }).to.throw(Error);
        });
    });

    describe('isSuccess', () => {
        it('Should return true if the status is 200', () => {
            const response = new OCAPIResponse({
                status: 200
            });

            expect(response.isSuccess()).to.equal(true);
        });

        it('Should return false if the status is not 200', () => {
            const response = new OCAPIResponse({
                status: 500
            });

            expect(response.isSuccess()).to.equal(false);
        });
    });

    describe('getFaultMessage', () => {
        it('Should return the fault message if the status is not 200', () => {
            const response = new OCAPIResponse({
                status: 500,
                data: {
                    fault: {
                        message: 'Foo'
                    }
                }
            });

            expect(response.getFaultMessage()).to.equal('Foo');
        });

        it('Should return a fallback message if the status is 200', () => {
            const response = new OCAPIResponse({
                status: 200
            });

            expect(response.getFaultMessage()).to.equal('No Fault Message.');
        });

        it('Should return a fallback message if the status is not 200 and no fault message is present', () => {
            const response = new OCAPIResponse({
                status: 500
            });

            expect(response.getFaultMessage()).to.equal('No Fault Message.');
        });
    });
});