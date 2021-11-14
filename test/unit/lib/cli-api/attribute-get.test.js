const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');


const attributes = {
    attribute: {
        'id': 'attribute',
        'value_type': 'string',
        'system': false,
    },
    attribute2: {
        'id': 'attribute2',
        'value_type': 'string',
        'system': false,
    },
    systemAttribute: {
        'id': 'attribute_sytem',
        'value_type': 'string',
        'system': true,
    }
}


const dummyObject = {
    data: [
        attributes.attribute, attributes.attribute2, attributes.systemAttribute,
    ]
}

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

        sinon.stub(SystemObjectDefinition.prototype, 'getSingleObjectAttributeDefinition').callsFake((object, attribute) => {
            return new Promise((resolve, reject) => {
                resolve({
                    isSuccess: () => true,
                    data: attributes[attribute]
                });
            });
        });

        sinon.stub(SystemObjectDefinition.prototype, 'getObjectAttributeDefinitions').resolves({
            isSuccess: () => true,
            data: dummyObject
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
            expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object','attribute.json'));
            expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify(attributes.attribute, null, 4));

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

    describe('All Attribute ', () => {
        it('Should save all attributes when only an object is passed', async () => {
            await attributeGet({
                object: 'object'
            });

            expect(writeFileSpy.calledTwice).to.be.true;
            expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object','attribute.json'));
            expect(writeFileSpy.secondCall.args[0]).to.contain(path.join('object', 'attribute2.json'));
            expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify(attributes.attribute, null, 4));
            expect(writeFileSpy.secondCall.args[1]).to.equal(JSON.stringify(attributes.attribute2, null, 4));

            // Output
            expect(outputFieldsSpy.called).to.be.false;
            expect(outputSuccessSpy.calledTwice).to.be.true;
            expect(outputSuccessSpy.firstCall.args[0]).to.contain('object/attribute');
            expect(outputSuccessSpy.secondCall.args[0]).to.contain('object/attribute2');

            expect(outputCommandBookEndSpy.calledTwice).to.be.true;
        });
    });
});