// Initializes the `workplans` service on path `/workplans`
const createService = require('feathers-nedb');
const createModel = require('../../models/workplans.model');
const hooks = require('./workplans.hooks');
const filters = require('./workplans.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'workplans',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workplans', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workplans');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
