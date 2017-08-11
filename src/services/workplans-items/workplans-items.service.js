// Initializes the `workplans_items` service on path `/workplans-items`
const createService = require('feathers-nedb');
const createModel = require('../../models/workplans-items.model');
const hooks = require('./workplans-items.hooks');
const filters = require('./workplans-items.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'workplans-items',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workplans-items', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workplans-items');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
