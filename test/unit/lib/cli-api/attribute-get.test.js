const proxyquire = require('proxyquire').noCallThru();
const { assert, expect } = require('chai');
const sinon = require('sinon');

const dummyAttribute = {
    'name': 'attribute',
    'type': 'string',
    'value': 'value',
};

const writeFileSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();

const attributeGet = proxyquire('../../../../lib/cli-api/attribute-get', {
    '../cli-interface/ui': {
        outputFields: outputFieldsSpy,
        outputSuccess: outputSuccessSpy,
        outputError: (error) => {
            throw new Error(error);
        },
        cliCommandBookend :outputCommandBookEndSpy
    },
    '../api/OCAPI': {
        SystemObjectDefinition: class SystemObjectDefinition {
            async getSingleObjectAttributeDefinition (object, attribute) {
                return new Promise((resolve, reject) => {
                    if (object && attribute) {
                        resolve({
                            isSuccess: () => true,
                            data: dummyAttribute
                        });
                    } else {
                        reject(new Error('Invalid object or attribute'));
                    }
                });
            }
        }
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
    });
});