const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { cleanOCAPIResponse } = require('../../../../lib/util/OCAPICleaner');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

let dummyObjects = {
    data: [{
        object_type: 'object1'
    }, {
        object_type: 'object2'
    }]
};

let dummyAttributeGroups = {
    data: [
        {
            id: 'group1',
        }, {
            id: 'group2',
        }
    ]
};

let dummyAttributeGroup = {
    id: 'group1',
    attribute_definitions: [{
        id: 'attribute1',
    }, {
        id: 'attribute2',
    }]
};

const writeFileSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();

let getAttributeGroupForObjectStub;
let getAttributeGroupsForObjectStub;
let getObjectTypesOCAPICallStub;

const attributeGroupGet = proxyquire('../../../../lib/cli-api/attributegroup-get', {
    '../cli-interface/ui': {
        outputFields: outputFieldsSpy,
        outputSuccess: outputSuccessSpy,
        outputError: outputErrorSpy,
        cliCommandBookend :outputCommandBookEndSpy
    },
    '../api/OCAPI': {
        SystemObjectDefinition: SystemObjectDefinition
    },
    'fs': {
        existsSync: () => true,
        writeFileSync: writeFileSpy,
    },
});

describe('attributegroup-get', () => {
    beforeEach(() => {
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputErrorSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();
        writeFileSpy.resetHistory();

        getAttributeGroupForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupForObject').callsFake((object, attribute, onlyDefinitions) => {
            return new Promise((resolve, reject) => {
                let result = {...dummyAttributeGroup};

                if (onlyDefinitions) {
                    result = {
                        attribute_definitions: result.attribute_definitions
                    }
                } else {
                    delete result.attribute_definitions;
                }

                resolve({
                    isSuccess: () => true,
                    data: result
                });
            });
        });

        getAttributeGroupsForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupsForObject').resolves({
            isSuccess: () => true,
            data: dummyAttributeGroups
        });

        getObjectTypesOCAPICallStub = sinon.stub(SystemObjectDefinition.prototype, 'getSystemObjectDefinitions').resolves({
            isSuccess: () => true,
            data: dummyObjects
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Single Attribute Group', () => {
        it('should save a single attribute group for an object when Object and Attribute Group are passed', async () => {
            await attributeGroupGet({
                object: 'object',
                attributeGroup: 'group1'
            })

            let resultGroupWithoutDefinitions = {...dummyAttributeGroup}
            delete resultGroupWithoutDefinitions.attribute_definitions;

            expect(writeFileSpy.calledTwice).to.be.true;
            expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object', 'groups', 'group1.json'));
            expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify(cleanOCAPIResponse(resultGroupWithoutDefinitions), null, 4));
            expect(writeFileSpy.secondCall.args[0]).to.contain(path.join('object', 'groups', 'group1-assignments.json'));
            expect(writeFileSpy.secondCall.args[1]).to.equal(JSON.stringify(['attribute1', 'attribute2'], null, 4));

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledOnce).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('group1');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;

            // Should call the OCAPI
            expect(getAttributeGroupForObjectStub.calledTwice).to.be.true;
            expect(getAttributeGroupsForObjectStub.called).to.be.false;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });

        it('should output debug information if the debug flag is set', async () => {
            await attributeGroupGet({
                object: 'object',
                attributeGroup: 'group1',
                debug: true
            })

            // Output
            expect(outputFieldsSpy.calledOnce).to.be.true;
            expect(outputSuccessSpy.calledOnce).to.be.true;
            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });

        it('should not save files if the doNotSave flag is set', async () => {
            await attributeGroupGet({
                object: 'object',
                attributeGroup: 'group1',
                doNotSave: true
            })

            expect(writeFileSpy.notCalled).to.be.true;

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledOnce).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('group1');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;

            // Should call the OCAPI
            expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
            expect(getAttributeGroupsForObjectStub.called).to.be.false;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });

        it('should output an error if we get an error response from the OCAPI', async () => {
            sinon.restore();

            getAttributeGroupForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupForObject').resolves({
                isSuccess: () => false,
                getFaultMessage: () => 'Test Error'
            });

            await attributeGroupGet({
                object: 'object',
                attributeGroup: 'group1'
            })

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.called).to.be.false;
            expect(outputErrorSpy.calledOnce).to.be.true;
            expect(outputErrorSpy.firstCall.args[0]).to.contain('Test Error');

            // Should call the OCAPI
            expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
            expect(getAttributeGroupsForObjectStub.called).to.be.false;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });
    });

    describe('All Attribute Groups of a single object', () => {
        it('should save all Attribute Groups for an object when Object is passed', async () => {
            await attributeGroupGet({
                object: 'object'
            })

            let resultGroupWithoutDefinitions = {...dummyAttributeGroup}
            delete resultGroupWithoutDefinitions.attribute_definitions;

            expect(writeFileSpy.callCount).to.equal(4);

            // First group
            expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object', 'groups', 'group1.json'));
            expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify(cleanOCAPIResponse(resultGroupWithoutDefinitions), null, 4));
            expect(writeFileSpy.secondCall.args[0]).to.contain(path.join('object', 'groups', 'group1-assignments.json'));
            expect(writeFileSpy.secondCall.args[1]).to.equal(JSON.stringify(['attribute1', 'attribute2'], null, 4));

            // Second group
            expect(writeFileSpy.thirdCall.args[0]).to.contain(path.join('object', 'groups', 'group2.json'));
            expect(writeFileSpy.thirdCall.args[1]).to.equal(JSON.stringify(cleanOCAPIResponse(resultGroupWithoutDefinitions), null, 4));
            expect(writeFileSpy.getCall(3).args[0]).to.contain(path.join('object', 'groups', 'group2-assignments.json'));
            expect(writeFileSpy.getCall(3).args[1]).to.equal(JSON.stringify(['attribute1', 'attribute2'], null, 4));

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledTwice).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('group1');
            expect(outputSuccessSpy.secondCall.args[0]).to.contain('group2');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;

            // Should call the OCAPI
            expect(getAttributeGroupForObjectStub.callCount).to.equal(4);
            expect(getAttributeGroupsForObjectStub.calledOnce).to.be.true;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });

        it('should output an error if we get an error response from the OCAPI when fetching all Attribute Groups', async () => {
            sinon.restore();

            getAttributeGroupsForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupsForObject').resolves({
                isSuccess: () => false,
                getFaultMessage: () => 'Test Error'
            });

            await attributeGroupGet({
                object: 'object'
            })

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.called).to.be.false;
            expect(outputErrorSpy.calledOnce).to.be.true;
            expect(outputErrorSpy.firstCall.args[0]).to.contain('Test Error');

            // Should call the OCAPI
            expect(getAttributeGroupsForObjectStub.calledOnce).to.be.true;
            expect(getAttributeGroupForObjectStub.called).to.be.false;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });

        it('should output an error if we get an error response from the OCAPI when fetching an Attribute Group', async () => {
            sinon.restore();

            getAttributeGroupsForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupsForObject').resolves({
                isSuccess: () => true,
                data: dummyAttributeGroups
            });

            getAttributeGroupForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupForObject').resolves({
                isSuccess: () => false,
                getFaultMessage: () => 'Test Error'
            });

            await attributeGroupGet({
                object: 'object'
            })

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.called).to.be.false;
            expect(outputErrorSpy.calledTwice).to.be.true;
            expect(outputErrorSpy.firstCall.args[0]).to.contain('Test Error');
            expect(outputErrorSpy.secondCall.args[0]).to.contain('Test Error');

            // Should call the OCAPI
            expect(getAttributeGroupsForObjectStub.calledOnce).to.be.true;
            expect(getAttributeGroupForObjectStub.calledTwice).to.be.true;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });

        it('should output debug information if the debug flag is set', async () => {
            await attributeGroupGet({
                object: 'object',
                debug: true
            })

            // Output
            expect(outputFieldsSpy.calledTwice).to.be.true;
            expect(outputSuccessSpy.calledTwice).to.be.true;
            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });

        it('should not save files if the doNotSave flag is set', async () => {
            await attributeGroupGet({
                object: 'object',
                doNotSave: true
            })

            expect(writeFileSpy.notCalled).to.be.true;

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledTwice).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('group1');
            expect(outputSuccessSpy.secondCall.args[0]).to.contain('group2');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;

            // Should call the OCAPI
            expect(getAttributeGroupForObjectStub.calledTwice).to.be.true;
            expect(getAttributeGroupsForObjectStub.calledOnce).to.be.true;
            expect(getObjectTypesOCAPICallStub.called).to.be.false;
        });
    });
});