const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

const writeFileSpy = sinon.spy();
const readFileStub = sinon.stub();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();
let fileExistsStub = sinon.stub();

let getAttributeGroupForObjectStub;
let updateAttributeGroupStub;
let createAttributeGroupStub;
let assignAttributesToGroupStub;

const attributeGroupPush = proxyquire('../../../../lib/cli-api/attributegroup-push', {
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
        existsSync: fileExistsStub,
        writeFileSync: writeFileSpy,
        readFileSync: readFileStub
    },
    '../util/attributeMapping': {
        mapFieldsToTable: () => {}
    },
});

describe('attributegroup-push', () => {
    before(() => {
        getAttributeGroupForObjectStub = sinon.stub(SystemObjectDefinition.prototype, 'getAttributeGroupForObject').resolves({
            isSuccess: () => true,
            data: {
                _resource_state: 'STATE_ID'
            }
        });

        updateAttributeGroupStub = sinon.stub(SystemObjectDefinition.prototype, 'updateAttributeGroup').resolves({
            isSuccess: () => true
        });

        createAttributeGroupStub = sinon.stub(SystemObjectDefinition.prototype, 'createAttributeGroup').resolves({
            isSuccess: () => true
        });

        assignAttributesToGroupStub = sinon.stub(SystemObjectDefinition.prototype, 'assignAttributeToGroup').resolves({
            isSuccess: () => true
        });
    });

    beforeEach(() => {
        fileExistsStub.resetHistory();
        writeFileSpy.resetHistory();
        readFileStub.resetHistory();
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputErrorSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();
        getAttributeGroupForObjectStub.resetHistory();
        updateAttributeGroupStub.resetHistory();
        createAttributeGroupStub.resetHistory();
        assignAttributesToGroupStub.resetHistory();
    });

    it('should push an an attribute group when an object and attribute group are passed', async () => {
        fileExistsStub.returns(true);
        readFileStub.returns('["attribute"]');

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledTwice).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(readFileStub.called).to.be.true;
        expect(readFileStub.firstCall.args[0]).to.contain(path.join('object','groups', 'group.json'));

        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.calledOnce).to.be.true;
        expect(createAttributeGroupStub.called).to.be.false;
        expect(assignAttributesToGroupStub.calledOnce).to.be.true;
    });

    it('should create a template file if the attribute group file does not exist yet for the given parameters', async () => {
        fileExistsStub.returns(false);

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.called).to.be.false;

        expect(writeFileSpy.called).to.be.true;
        expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object','groups', 'group.json'));

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.called).to.be.false;
        expect(createAttributeGroupStub.called).to.be.false;
        expect(assignAttributesToGroupStub.called).to.be.false;
    });

    it('should print debug information when the debug flag is passed', async () => {
        fileExistsStub.returns(true);

        readFileStub.returns('["attribute"]');

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group',
            debug: 'true'
        });

        expect(outputFieldsSpy.calledOnce).to.be.true;
        expect(outputSuccessSpy.callCount).to.equal(3);
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.calledTwice).to.be.true;
        expect(writeFileSpy.called).to.be.false;
    });


    it('should forcibly recreate the attribute group when the forceRecreate flag is set to true', async () => {
        fileExistsStub.returns(true);
        readFileStub.returns('["attribute"]');

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group',
            forceRecreate: true
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledTwice).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.called).to.be.true;
        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.called).to.be.false;
        expect(createAttributeGroupStub.calledOnce).to.be.true;
        expect(assignAttributesToGroupStub.calledOnce).to.be.true;
    });

    it('should attempt to create the attribute if the fetch fails', async () => {
        fileExistsStub.returns(true);
        readFileStub.returns('["attribute"]');

        getAttributeGroupForObjectStub.resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'fault message'
        });

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledTwice).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.called).to.be.true;
        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.called).to.be.false;
        expect(createAttributeGroupStub.calledOnce).to.be.true;
        expect(assignAttributesToGroupStub.calledOnce).to.be.true;
    });

    it('should return an error when updating the attribute group fails', async () => {
        fileExistsStub.returns(true);

        getAttributeGroupForObjectStub.resolves({
            isSuccess: () => true,
            data: {
                _resource_state: 'STATE_ID'
            }
        });

        updateAttributeGroupStub.resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'fault message'
        });

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.called).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.called).to.be.true;
        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.calledOnce).to.be.true;
        expect(createAttributeGroupStub.called).to.be.false;
        expect(assignAttributesToGroupStub.called).to.be.false;
    });

    it('should return an error when creating the attribute group fails', async () => {
        fileExistsStub.returns(true);

        getAttributeGroupForObjectStub.resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'fault message'
        });

        createAttributeGroupStub.resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'fault message'
        });

        await attributeGroupPush({
            object: 'object',
            attributeGroup: 'group',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.called).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileStub.called).to.be.true;
        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getAttributeGroupForObjectStub.calledOnce).to.be.true;
        expect(createAttributeGroupStub.calledOnce).to.be.true;
        expect(updateAttributeGroupStub.called).to.be.false;
        expect(assignAttributesToGroupStub.called).to.be.false;
    });
});
