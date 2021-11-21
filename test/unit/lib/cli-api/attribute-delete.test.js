const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

const unlinkSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();

let deleteOCAPICallStub;

const attributeDelete = proxyquire('../../../../lib/cli-api/attribute-delete', {
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
        unlinkSync: unlinkSpy,
    },
});

describe('attribute-delete', () => {

    beforeEach(() => {
        unlinkSpy.resetHistory();
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputErrorSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();

        deleteOCAPICallStub = sinon.stub(SystemObjectDefinition.prototype, 'deleteSingleObjectAttributeDefinition').resolves({
            isSuccess: () => true
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('Should delete an attribute when an object and attribute are passed', async () => {
        await attributeDelete({
            object: 'object',
            attribute: 'attribute'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.notCalled).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        // Should have deleted the associated file
        expect(unlinkSpy.calledOnce).to.be.true;
        expect(unlinkSpy.firstCall.args[0]).to.contain(path.join('object','attribute.json'));

        // Should have called the API
        expect(deleteOCAPICallStub.calledOnce).to.be.true;
    });

    it('Should keep the associated file when the "preserveFile" flag is passed', async () => {
        await attributeDelete({
            object: 'object',
            attribute: 'attribute',
            preserveFile: true
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.notCalled).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        // Should not have deleted the associated file
        expect(unlinkSpy.notCalled).to.be.true;
    });

    it('Should output an error if we get an error response from the OCAPI', async () => {
        sinon.restore();

        sinon.stub(SystemObjectDefinition.prototype, 'deleteSingleObjectAttributeDefinition').resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'Error'
        });

        await attributeDelete({
            object: 'object',
            attribute: 'attribute'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.notCalled).to.be.true;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        // Should not have deleted the associated file
        expect(unlinkSpy.notCalled).to.be.true;
    });
});