const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

const writeFileSpy = sinon.spy();
const readFileSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();
let fileExistsStub = sinon.stub();

let getSingleAttributeOCAPICallStub;
let updateSingleAttributeOCAPICallStub;
let createSingleAttributeOCAPICallStub;

const attributePush = proxyquire('../../../../lib/cli-api/attribute-push', {
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
        readFileSync: readFileSpy
    },
    '../util/attributeMapping': {
        mapFieldsToTable: () => {}
    },
});

describe('attribute-push', () => {
    beforeEach(() => {
        fileExistsStub.resetHistory();
        writeFileSpy.resetHistory();
        readFileSpy.resetHistory();
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputErrorSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();

        getSingleAttributeOCAPICallStub = sinon.stub(SystemObjectDefinition.prototype, 'getSingleObjectAttributeDefinition').resolves({
            isSuccess: () => true,
            data: {
                _resource_state: 'STATE_ID'
            }
        });

        updateSingleAttributeOCAPICallStub = sinon.stub(SystemObjectDefinition.prototype, 'updateSingleObjectAttributeDefinition').resolves({
            isSuccess: () => true
        });

        createSingleAttributeOCAPICallStub = sinon.stub(SystemObjectDefinition.prototype, 'createSingleObjectAttributeDefinition').resolves({
            isSuccess: () => true
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should push an an attribute when an object and attribute are passed', async () => {
        fileExistsStub.returns(true);

        await attributePush({
            object: 'object',
            attribute: 'attribute'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(readFileSpy.called).to.be.true;
        expect(readFileSpy.firstCall.args[0]).to.contain(path.join('object','attribute.json'));

        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getSingleAttributeOCAPICallStub.calledOnce).to.be.true;
        expect(updateSingleAttributeOCAPICallStub.calledOnce).to.be.true;
    });

    it('should create a template file if the attribute file does not exist yet for the given parameters', async () => {
        fileExistsStub.returns(false);

        await attributePush({
            object: 'object',
            attribute: 'attribute'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileSpy.called).to.be.false;

        expect(writeFileSpy.called).to.be.true;
        expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object','attribute.json'));

        // OCAPI Calls
        expect(getSingleAttributeOCAPICallStub.calledOnce).to.be.true;
        expect(updateSingleAttributeOCAPICallStub.notCalled).to.be.true;
    });

    it('should print debug information when the debug flag is passed', async () => {
        fileExistsStub.returns(true);

        await attributePush({
            object: 'object',
            attribute: 'attribute',
            debug: true
        });

        expect(outputFieldsSpy.calledOnce).to.be.true;
        expect(outputSuccessSpy.calledTwice).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileSpy.calledOnce).to.be.true;
        expect(writeFileSpy.called).to.be.false;
    });

    it('should forcibly recreate the object when the forceRecreate flag is set to true', async () => {
        fileExistsStub.returns(true);

        await attributePush({
            object: 'object',
            attribute: 'attribute',
            forceRecreate: true
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        expect(readFileSpy.called).to.be.true;
        expect(writeFileSpy.called).to.be.false;

        // OCAPI Calls
        expect(getSingleAttributeOCAPICallStub.calledOnce).to.be.true;
        expect(updateSingleAttributeOCAPICallStub.notCalled).to.be.true;
        expect(createSingleAttributeOCAPICallStub.calledOnce).to.be.true;
    });
});
