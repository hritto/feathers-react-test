const assert = require('assert');
const app = require('../../src/app');

describe('\'workplans_items\' service', () => {
  it('registered the service', () => {
    const service = app.service('workplans-items');

    assert.ok(service, 'Registered the service');
  });
});
