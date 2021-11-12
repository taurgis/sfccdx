const expect = require('chai').expect;
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const OCAPIClient = require('../../../../lib/api/OCAPI/OCAPIClient');

describe('OCAPI: SystemObjectDefinition', () => {
    let systemObjectDefinition;

    beforeEach(() => {
        systemObjectDefinition = new SystemObjectDefinition({});

        systemObjectDefinition.getBearerToken = async () => {
            return new Promise((resolve) => {
                resolve('123456789');
            });
        };

        systemObjectDefinition.requestInstance = {
            get: async () => {
                return new Promise((resolve) => {
                    resolve({
                        status: 200,
                        data: {}
                    });
                });
            },
            patch: async () => {
                return new Promise((resolve) => {
                    resolve({
                        status: 200,
                        data: {}
                    });
                });
            },
            put: async () => {
                return new Promise((resolve) => {
                    resolve({
                        status: 200,
                        data: {}
                    });
                });
            },
            delete: async () => {
                return new Promise((resolve) => {
                    resolve({
                        status: 204,
                        data: {}
                    });
                });
            }
        }
    });

    describe ('Constructor', () => {
        it ('Should create a new SystemObjectDefinition object', () => {
            expect(systemObjectDefinition).to.be.an.instanceof(SystemObjectDefinition);
        });

        it ('Should be an instance of OCAPIClient', () => {
            expect(systemObjectDefinition).to.be.an.instanceof(OCAPIClient);
        });

        it('Should throw an exception if no configuration is passed', () => {
            expect(() => {
                new SystemObjectDefinition();
            }).to.throw();
        });

        it('Should set the basePath', () => {
            expect(systemObjectDefinition.basePath).to.equal('/system_object_definitions');
        })
    });

    describe('getSystemObjectDefinitions', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getSystemObjectDefinitions()).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getSystemObjectDefinitions().then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });
    });

    describe('getObjectAttributeDefinitions', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getObjectAttributeDefinitions('123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getObjectAttributeDefinitions('123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.getObjectAttributeDefinitions().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });
    });

    describe('getSingleObjectAttributeDefinition', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getSingleObjectAttributeDefinition('123456789', '123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getSingleObjectAttributeDefinition('123456789', '123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.getSingleObjectAttributeDefinition().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.getSingleObjectAttributeDefinition('123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });
    });

    describe('createSingleObjectAttributeDefinition', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.createSingleObjectAttributeDefinition('123456789', '123456789', '{}')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.createSingleObjectAttributeDefinition('123456789', '123456789', '{}').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.createSingleObjectAttributeDefinition().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.createSingleObjectAttributeDefinition('123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });

        it('Should return an error when no body is passed', () => {
            return systemObjectDefinition.createSingleObjectAttributeDefinition('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Body is required');
            });
        });
    });

    describe('updateSingleObjectAttributeDefinition', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.updateSingleObjectAttributeDefinition('123456789', '123456789', 'a12316516', '{}')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.updateSingleObjectAttributeDefinition('123456789', '123456789', 'a12316516', '{}').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.updateSingleObjectAttributeDefinition().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.updateSingleObjectAttributeDefinition('123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });

        it('Should return an error when no resource state is passed', () => {
            return systemObjectDefinition.updateSingleObjectAttributeDefinition('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Resource State is required');
            });
        });

        it('Should return an error when no body is passed', () => {
            return systemObjectDefinition.updateSingleObjectAttributeDefinition('123456789', '123456789', 'afz6f4z6ef4').catch(error => {
                expect(error.message).to.equal('Body is required');
            });
        });
    });

    describe('deleteSingleObjectAttributeDefinition', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.deleteSingleObjectAttributeDefinition('123456789', '123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.deleteSingleObjectAttributeDefinition('123456789', '123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(204);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.deleteSingleObjectAttributeDefinition().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.deleteSingleObjectAttributeDefinition('123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });
    });

    describe('getAttributeGroupsForObject', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getAttributeGroupsForObject('123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getAttributeGroupsForObject('123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.getAttributeGroupsForObject().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });
    });

    describe('getAttributeGroupForObject', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.getAttributeGroupForObject('123456789', '123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.getAttributeGroupForObject('123456789', '123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.getAttributeGroupForObject().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.getAttributeGroupForObject('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });
    });

    describe('deleteAttributeGroupForObject', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.deleteAttributeGroupForObject('123456789', '123456789')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.deleteAttributeGroupForObject('123456789', '123456789').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(204);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.deleteAttributeGroupForObject().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.deleteAttributeGroupForObject('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });
    });

    describe('createAttributeGroup', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.createAttributeGroup('123456789', '123456789', '{}')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.createAttributeGroup('123456789', '123456789', '{}').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.createAttributeGroup().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.createAttributeGroup('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });

        it('Should return an error when no body is passed', () => {
            return systemObjectDefinition.createAttributeGroup('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Body is required');
            });
        });
    });

    describe('updateAttributeGroup', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.updateAttributeGroup('123456789', '123456789', 'a12316516', '{}')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.updateAttributeGroup('123456789', '123456789', 'a12316516', '{}').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.updateAttributeGroup().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.updateAttributeGroup('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });

        it('Should return an error when no resource state is passed', () => {
            return systemObjectDefinition.updateAttributeGroup('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Resource State is required');
            });
        });

        it('Should return an error when no body is passed', () => {
            return systemObjectDefinition.updateAttributeGroup('123456789', '123456789', 'afz6f4z6ef4').catch(error => {
                expect(error.message).to.equal('Body is required');
            });
        });
    });

    describe('assignAttributeToGroup', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.assignAttributeToGroup('123456789', '123456789', 'a12316516')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.assignAttributeToGroup('123456789', '123456789', 'a12316516').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(200);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.assignAttributeToGroup().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.assignAttributeToGroup('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.assignAttributeToGroup('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });
    });

    describe('deleteAssignmentToAttributeToGroup', () => {
        it('Should return a promise.', () => {
            expect(systemObjectDefinition.deleteAssignmentToAttributeToGroup('123456789', '123456789', 'a12316516')).to.be.an.instanceof(Promise);
        });

        it('Should return a response.', () => {
            return systemObjectDefinition.deleteAssignmentToAttributeToGroup('123456789', '123456789', 'a12316516').then(response => {
                expect(response.data).to.exist;
                expect(response.status).to.equal(204);
            });
        });

        it('Should return an error when no object is passed', () => {
            return systemObjectDefinition.deleteAssignmentToAttributeToGroup().catch(error => {
                expect(error.message).to.equal('Object is required');
            });
        });

        it('Should return an error when no attribute group is passed', () => {
            return systemObjectDefinition.deleteAssignmentToAttributeToGroup('123456789').catch(error => {
                expect(error.message).to.equal('Attribute Group is required');
            });
        });

        it('Should return an error when no attribute is passed', () => {
            return systemObjectDefinition.deleteAssignmentToAttributeToGroup('123456789', '123456789').catch(error => {
                expect(error.message).to.equal('Attribute is required');
            });
        });
    });
});