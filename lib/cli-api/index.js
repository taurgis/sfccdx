const attributeGet = require('./attribute-get');
const attributeDelete = require('./attribute-delete');
const attributePush = require('./attribute-push');
const attributeGroupAssignmentDelete = require('./attributegroup-assignment-delete');
const attributeGroupDelete = require('./attributegroup-delete');
const attributeGroupGet = require('./attributegroup-get');
const attributeGroupPush = require('./attributegroup-push');

module.exports = {
    attributeGet, attributeDelete, attributePush, attributeGroupAssignmentDelete, 
    attributeGroupDelete, attributeGroupGet, attributeGroupPush
}
