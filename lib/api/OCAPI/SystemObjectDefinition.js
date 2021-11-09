const OCAPIClient = require("./OCAPIClient");
const OCAPIResponse = require("./OCAPIResponse");
const addGenericHeader = require('../request/addGenericHeader');

/**
 * Class representing the System Object Definition Data API.
 */
class SystemObjectDefinition extends OCAPIClient {
    constructor(config) {
        super(config);

        this.basePath = `/system_object_definitions`;
    }
    /**
     * Action to get all the system objects with no filtering.
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async getSystemObjectDefinitions() {
        const basePath = this.basePath + `?start=0&count=1000`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.get(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to get attribute definition information.
     *
     * @param {string} object The object to get the attribute definitions for
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async getObjectAttributeDefinitions(object) {
        const basePath = this.basePath + `/${object}/attribute_definitions?start=0&count=1000&select=(**)`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.get(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to get a attribute definition.
     *
     * @param {string} object The object to get the attribute definition for
     * @param {string} attribute The attribute to get the definition for
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async getSingleObjectAttributeDefinition(object, attribute) {
        const basePath = this.basePath + `/${object}/attribute_definitions/${attribute}?expand=value`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.get(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to create an attribute definition
     *
     * @param {string} object The object to create the attribute definitions for
     * @param {string} attribute The attribute to create the definition for
     * @param {string} body The body of the request
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async createSingleObjectAttributeDefinition(object, attribute, body) {
        const basePath = this.basePath + `/${object}/attribute_definitions/${attribute}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.put(requestDefinition.url, body, requestDefinition));
    }

    /**
     * Action to update an attribute definition
     *
     * @param {string} object The object to update the attribute definitions for
     * @param {string} attribute The attribute to update the definition for
     * @param {string} resourceState The resource state of the attribute definition (this looks like an ID)
     * @param {string} body The body of the request
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async updateSingleObjectAttributeDefinition(object, attribute, resourceState, body) {
        const basePath = this.basePath + `/${object}/attribute_definitions/${attribute}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        addGenericHeader(requestDefinition, 'x-dw-resource-state', resourceState);

        return new OCAPIResponse(await this.requestInstance.patch(requestDefinition.url, body, requestDefinition));
    }

    /**
     * Action to delete an attribute definition
     *
     * @param {string} object The object to delete the attribute definitions for
     * @param {string} attribute The attribute to delete the definition for
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async deleteSingleObjectAttributeDefinition(object, attribute) {
        const basePath = this.basePath + `/${object}/attribute_definitions/${attribute}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.delete(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to get all the attribute groups with no filtering.
     *
     * @param {string} object The object to get the attribute groups for
     * @returns Promise<OCAPIResponse> The response
     */
    async getAttributeGroupsForObject(object) {
        const basePath = this.basePath + `/${object}/attribute_groups?start=0&count=1000&select=(**)`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.get(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to get attribute group information.
     *
     * @param {string} object The object to get the attribute group for
     * @param {string} attributeGroup The attribute group to get the information for
     * @param {boolean} onlyDefinitions If true, only the assigned definition information is returned
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async getAttributeGroupForObject(object, attributeGroup, onlyDefinitions) {
        let basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}`

        if (onlyDefinitions) {
            basePath += `?expand=definition&select=(attribute_definitions.(id))`
        }

        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.get(requestDefinition.url, requestDefinition));
    }

    /**
     * Deletes the attribute group by ID
     *
     * @param {string} object The object to delete the attribute group of
     * @param {string} attributeGroup The attribute group to delete
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async deleteAttributeGroupForObject(object, attributeGroup) {
        let basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}`

        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.delete(requestDefinition.url, requestDefinition));
    }

    /**
     * Action to create an Attribute Group
     *
     * @param {string} object The object to create the Attribute Group
     *  for
     * @param {string} attributeGroup The Attribute Group to create
     * @param {string} body The body of the request
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async createAttributeGroup(object, attributeGroup, body) {
        const basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.put(requestDefinition.url, body, requestDefinition));
    }

    /**
     * Action to update an Attribute Group.
     *
     * @param {string} object The object to update the attribute group for
     * @param {string} attributeGroup The Attribute Group to update
     * @param {string} resourceState The resource state of the attribute group (this looks like an ID)
     * @param {string} body The body of the request
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async updateAttributeGroup(object, attributeGroup, resourceState, body) {
        const basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        addGenericHeader(requestDefinition, 'x-dw-resource-state', resourceState);

        return new OCAPIResponse(await this.requestInstance.patch(requestDefinition.url, body, requestDefinition));
    }

    /**
     * Assign an attribute definition to an attribute group.
     *
     * @param {string} object The object of the Attribute Group
     * @param {string} attributeGroup The Attribute Group
     * @param {string} attribute The Attribute to assign
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async assignAttributeToGroup(object, attributeGroup, attribute) {
        const basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}/attribute_definitions/${attribute}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.put(requestDefinition.url, null, requestDefinition));
    }

    /**
     * Un-assign an attribute definition from an attribute group.
     *
     * @param {string} object The object of the Attribute Group
     * @param {string} attributeGroup The Attribute Group
     * @param {string} attribute The Attribute to un-assign
     *
     * @returns Promise<OCAPIResponse> The response
     */
    async deleteAssignmentToAttributeToGroup(object, attributeGroup, attribute) {
        const basePath = this.basePath + `/${object}/attribute_groups/${attributeGroup}/attribute_definitions/${attribute}`
        const requestDefinition = this.initializeRequestDefinition(basePath)

        return new OCAPIResponse(await this.requestInstance.delete(requestDefinition.url, requestDefinition));
    }
}

module.exports = SystemObjectDefinition;
