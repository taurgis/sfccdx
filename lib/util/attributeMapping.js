const ATTRIBUTES_SYSTEM_OBJECT = ['display_name.default', 'effective_id', 'field_length', 'key',
    'localizable', 'mandatory', 'order_required', 'site_specific', 'system', 'value_type', 'externally_managed'];
const ATTRIBUTES_ATTRIBUTE_GROUP = ['display_name.default','id', 'description.default', 'internal'];

/* eslint-disable no-param-reassign */
function resolve(obj, path) {
    // eslint-disable-next-line no-multi-assign
    const root = obj = [obj];
    path = [0, ...path];
    while (path.length > 1) obj = obj[path.shift()];
    return [obj, path[0], root];
}

Object.get = (obj, path) => {
    const [parent, key] = resolve(obj, path);

    if (parent) {
        return parent[key];
    }

    return null;
};

const mapFieldsToTable = (result, fieldsToMap) => {
    const tableValues = [];

    fieldsToMap.forEach((attribute) => {
        tableValues.push([attribute, `${Object.get(result, attribute.split('.'))}`]);
    });

    return tableValues;
};

module.exports = {
    mapFieldsToTable, ATTRIBUTES_SYSTEM_OBJECT, ATTRIBUTES_ATTRIBUTE_GROUP,
};
