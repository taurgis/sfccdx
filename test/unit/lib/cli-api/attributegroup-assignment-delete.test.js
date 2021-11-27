const proxyquire = require('proxyquire').noCallThru();
const SystemObjectDefinition = require('../../../../lib/api/OCAPI/SystemObjectDefinition');
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const { kill } = require('process');

const writeFileSpy = sinon.spy();
const readFileStub = sinon.stub();
const outputFieldsSpy = sinon.spy();
const outputSuccessSpy = sinon.spy();
const outputErrorSpy = sinon.spy();
const outputCommandBookEndSpy = sinon.spy();
let fileExistsStub = sinon.stub();

let deleteAssignmentToAttributeToGroup;

const attributegroupAssignmentDelete = proxyquire('../../../../lib/cli-api/attributegroup-assignment-delete', {
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

describe('attributegroup-assignment-delete', () => {
    before(() => {
        deleteAssignmentToAttributeToGroup = sinon.stub(SystemObjectDefinition.prototype, 'deleteAssignmentToAttributeToGroup').resolves({
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
        deleteAssignmentToAttributeToGroup.resetHistory();
    });

    it('should delete an attribute group assignment', async () => {
        fileExistsStub.returns(true);
        readFileStub.returns(JSON.stringify(
            ['attribute']
        ));

        await attributegroupAssignmentDelete({
            object: 'object',
            attributeGroup: 'attributeGroup',
            attribute: 'attribute',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(writeFileSpy.calledOnce).to.be.true;
        expect(readFileStub.calledOnce).to.be.true;
        expect(fileExistsStub.calledOnce).to.be.true;

        //Should have deleted the attribute group assignment
        expect(writeFileSpy.firstCall.args[0]).to.contain(path.join('object', 'groups', 'attributeGroup-assignments.json'));
        expect(writeFileSpy.firstCall.args[1]).to.equal(JSON.stringify([], null, 4));

        //OCAPI Calls
        expect(deleteAssignmentToAttributeToGroup.calledOnce).to.be.true;
    });

    it('should note update the file if the preserveFile flag is passed', async () => {
        fileExistsStub.returns(true);
        readFileStub.returns(JSON.stringify(
            ['attribute']
        ));

        await attributegroupAssignmentDelete({
            object: 'object',
            attributeGroup: 'attributeGroup',
            attribute: 'attribute',
            preserveFile: true
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.calledOnce).to.be.true;
        expect(outputErrorSpy.called).to.be.false;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(writeFileSpy.called).to.be.false;
        expect(readFileStub.called).to.be.false;
        expect(fileExistsStub.called).to.be.false;

        //Should have deleted the attribute group assignment
        expect(deleteAssignmentToAttributeToGroup.calledOnce).to.be.true;
    });

    it('should return an error when deleting the attribute from the group fails', async () => {
        sinon.restore();

        deleteAssignmentToAttributeToGroup = sinon.stub(SystemObjectDefinition.prototype, 'deleteAssignmentToAttributeToGroup').resolves({
            isSuccess: () => false,
            getFaultMessage: () => 'Fault Message'
        });

        await attributegroupAssignmentDelete({
            object: 'object',
            attributeGroup: 'attributeGroup',
            attribute: 'attribute',
        });

        expect(outputFieldsSpy.called).to.be.false;
        expect(outputSuccessSpy.called).to.be.false;
        expect(outputErrorSpy.calledOnce).to.be.true;
        expect(outputCommandBookEndSpy.calledTwice).to.be.true;

        expect(writeFileSpy.called).to.be.false;
        expect(readFileStub.called).to.be.false;
        expect(fileExistsStub.called).to.be.false;

        //Should have deleted the attribute group assignment
        expect(deleteAssignmentToAttributeToGroup.calledOnce).to.be.true;
    });
});