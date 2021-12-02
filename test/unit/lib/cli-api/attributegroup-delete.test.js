const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const { kill } = require('process');

const unlinkFileSpy = sinon.spy();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();
let fileExistsStub = sinon.stub();

let deleteAttributeGroupForObject;

const attributegroupDelete = proxyquire('../../../../lib/cli-api/attributegroup-delete', {
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
        unlinkSync: unlinkFileSpy
    },
    '../util/attributeMapping': {
        mapFieldsToTable: () => {}
    },
});

describe('attributegroup-delete', () => {
    before(() => {
        deleteAttributeGroupForObject = sinon.stub(SystemObjectDefinition.prototype, 'deleteAttributeGroupForObject').resolves({
            isSuccess: () => true
        });
    });

    beforeEach(() => {
        fileExistsStub.resetHistory();
        unlinkFileSpy.resetHistory();
        outputFieldsSpy.resetHistory();
        outputSuccessSpy.resetHistory();
        outputErrorSpy.resetHistory();
        outputCommandBookEndSpy.resetHistory();
        deleteAttributeGroupForObject.resetHistory();
    });

    it('should delete an attribute group.', async () => {
        fileExistsStub.returns(true);

        await attributegroupDelete({
            object: 'object',
            attributeGroup: 'attributeGroup',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(fileExistsStub.calledTwice).to.be.true;
        expect(unlinkFileSpy.calledTwice).to.be.true;

        //Should have deleted the attribute group & assignments
        expect(fileExistsStub.firstCall.args[0]).to.contain(path.join('object', 'groups', 'attributeGroup.json'));
        expect(fileExistsStub.secondCall.args[0]).to.contain(path.join('object', 'groups', 'attributeGroup-assignments.json'));
        expect(unlinkFileSpy.firstCall.args[0]).to.contain(path.join('object', 'groups', 'attributeGroup.json'));
        expect(unlinkFileSpy.secondCall.args[0]).to.contain(path.join('object', 'groups', 'attributeGroup-assignments.json'));

        //OCAPI Calls
        expect(deleteAttributeGroupForObject.calledOnce).to.be.true;
    });

    it('should keep the files if the preserveFile flag is passed', async () => {
        await attributegroupDelete({
            object: 'object',
            attributeGroup: 'attributeGroup',
            preserveFile: true,
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(fileExistsStub.called).to.be.false;
        expect(unlinkFileSpy.called).to.be.false;

        //OCAPI Calls
        expect(deleteAttributeGroupForObject.calledOnce).to.be.true;
    });

    it('should keep the files if the OCAPI call fails', async () => {
        deleteAttributeGroupForObject.resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'Fault Message'
        });

        await attributegroupDelete({
            object: 'object',
            attributeGroup: 'attributeGroup'
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.called).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(fileExistsStub.called).to.be.false;
        expect(unlinkFileSpy.called).to.be.false;

        //OCAPI Calls
        expect(deleteAttributeGroupForObject.calledOnce).to.be.true;
    });
});