const assert = require('assert');
const app = require('../../src/app');

describe('\'workplans\' service', () => {
  it('registered the service', () => {
    const service = app.service('workplans');

    assert.ok(service, 'Registered the service');
  });
});
