const SystemObjectDefinition = require("./SystemObjectDefinition");
const Token = require("./Token");

module.exports = {
    /**
     * Authenticate with the OCAPI using Basic Authentication with the given client id and client secret.
     *
     * @returns {Promise<string>} A promise that resolves to the access token.
     */
    authenticate: Token.get,
    SystemObjectDefinition,
}