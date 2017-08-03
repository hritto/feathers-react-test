const assert = require('assert');
const app = require('../../src/app');

describe('\'resource_data\' service', () => {
  it('registered the service', () => {
    const service = app.service('resource-data');

    assert.ok(service, 'Registered the service');
  });
});
