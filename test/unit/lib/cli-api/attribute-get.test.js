const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');


const dummyAttribute = {
    'name': 'attribute',
    'type': 'string',
    'value': 'value',
};

const writeFileSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();

const attributeGet = proxyquire('../../../../lib/cli-api/attribute-get', {
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

describe('attribute-get', () => {

    beforeEach(() => {
        writeFileSpy.resetHistory();
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();

        sinon.stub(SystemObjectDefinition.prototype, 'getSingleObjectAttributeDefinition').resolves({
            isSuccess: () => true,
            data: dummyAttribute
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Single Attribute', () => {
        it('Should save a single attribute for an object when Object and Attribute are passed', async () => {
            await attributeGet({
                object: 'object',
                attribute: 'attribute'
            });

            expect(writeFileSpy.calledOnce).to.be.true;
            expect(writeFileSpy.firstCall.args[0]).to.contain('attribute.json');
            expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify(dummyAttribute, null, 4));

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledOnce).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('object/attribute');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });

        it('Should output debug information if the option is set to true', async () => {
            await attributeGet({
                object: 'object',
                attribute: 'attribute',
                debug: true
            });

            expect(outputFieldsSpy.calledOnce).to.be.true;
            expect(outputSuccessSpy.calledOnce).to.be.true;
            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });

        it('Should output an error if we get an error response from the OCAPI', async () => {
            sinon.restore();

            sinon.stub(SystemObjectDefinition.prototype, 'getSingleObjectAttributeDefinition').resolves({
                isSuccess: () => false,
                getFaultMessage: () => 'Error'
            });

            await attributeGet({
                object: 'object',
                attribute: 'attribute',
                debug: true
            });

            expect(outputErrorSpy.calledOnce).to.be.true;
            expect(outputErrorSpy.firstCall.args[0]).to.equal('Error');
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.called).to.be.false;
            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });
    });
});