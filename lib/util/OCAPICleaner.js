function cleanOCAPIResponse(response) {
    const cleanedResponse = {...response};
    const attributesToRemove = ['_v', '_type', '_resource_state', 'link', 'effective_id', 'system', 'attribute_definitions_count'];

    const keys = Object.keys(cleanedResponse);

    attributesToRemove.forEach((attribute) => {
        if (keys.indexOf(attribute) > -1) {
            delete cleanedResponse[attribute];
        }
    });

    return cleanedResponse;
}

module.exports = {
    cleanOCAPIResponse,
};
