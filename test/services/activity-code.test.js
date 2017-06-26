const assert = require('assert');
const app = require('../../src/app');

describe('\'activity_code\' service', () => {
  it('registered the service', () => {
    const service = app.service('activity-code');

    assert.ok(service, 'Registered the service');
  });
});
