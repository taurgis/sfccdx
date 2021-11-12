const expect = require('chai').expect;
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const OCAPIClient = require('../../../../lib/api/OCAPI/OCAPIClient');

describe('OCAPI: SystemObjectDefinition', () => {
    describe ('Constructor', () => {
        it ('Should create a new SystemObjectDefinition object', () => {
            const systemObjectDefinition = new SystemObjectDefinition({});
            expect(systemObjectDefinition).to.be.an.instanceof(SystemObjectDefinition);
        });

        it ('Should be an instance of OCAPIClient', () => {
            const systemObjectDefinition = new SystemObjectDefinition({});
            expect(systemObjectDefinition).to.be.an.instanceof(OCAPIClient);
        });

        it('Should throw an exception if no configuration is passed', () => {
            expect(() => {
                new SystemObjectDefinition();
            }).to.throw();
        });

        it('Should set the basePath', () => {
            const systemObjectDefinition = new SystemObjectDefinition({});

            expect(systemObjectDefinition.basePath).to.equal('/system_object_definitions');
        })
    });

    describe('getSystemObjectDefinitions', () => {
        let systemObjectDefinition;

        beforeEach(() => {
            systemObjectDefinition = new SystemObjectDefinition({});
           
            systemObjectDefinition.getBearerToken = async () => {
                return new Promise((resolve) => {
                    resolve('123456789');
                });
            };

            systemObjectDefinition.requestInstance = {
                get: async (url) => {
                    return new Promise((resolve) => {
                        resolve({
                            status: 200,
                            data: {
                                data: [
                                    {
                                        id: '1',
                                        name: 'test'
                                    }
                                ]
                            }
                        });
                    });
                }
            }
        });

        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getSystemObjectDefinitions()).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getSystemObjectDefinitions().then(response => {
                expect(response.data.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });
    });
});