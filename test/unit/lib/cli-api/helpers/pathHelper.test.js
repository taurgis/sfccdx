const pathHelper = require('../../../../../lib/cli-api/helpers/pathHelper');
const expect = require('chai').expect;
const path = require('path');

describe('pathHelper', () => {
    describe('getBaseObjectMetadataPath', () => {
        it('should return the correct path', () => {
            const result = pathHelper.getBaseObjectMetadataPath();

            expect(result).to.equal(path.join(process.cwd(), 'data', 'meta', 'system-objecttype-extensions'));
        });
    });
});