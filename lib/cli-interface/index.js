const getEnvironment = require('./getEnvironment');
const verify = require('./verify');
const attributeGet = require('./attribute-get');
const attributeDelete = require('./attribute-delete');
const attributePush = require('./attribute-push');
const attributeGroupGet = require('./attributegroup-get');
const attributeGroupDelete = require('./attributegroup-delete');
const attributeGroupPush = require('./attributegroup-push');
const attributeGroupAssignmentDelete = require('./attributegroup-assignment-delete');

module.exports = {
    getEnvironment, verify, attributeGet, attributeDelete, attributePush, attributeGroupGet,
    attributeGroupDelete, attributeGroupPush, attributeGroupAssignmentDelete,
};
