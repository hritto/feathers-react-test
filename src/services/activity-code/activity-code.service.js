// Initializes the `activity_code` service on path `/activity-code`
const createService = require('feathers-nedb');
const createModel = require('../../models/activity-code.model');
const hooks = require('./activity-code.hooks');
const filters = require('./activity-code.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'activity-code',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/activity-code', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('activity-code');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
