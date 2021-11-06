function cleanOCAPIResponse(response) {
    const attributesToRemove = ['_v', '_type', '_resource_state', 'link', 'effective_id', 'system', 'attribute_definitions_count'];

    const keys = Object.keys(response);

    attributesToRemove.forEach((attribute) => {
        if (keys.indexOf(attribute) > -1) {
            delete response[attribute];
        }
    });

    return response;
}

module.exports = {
    cleanOCAPIResponse,
};
