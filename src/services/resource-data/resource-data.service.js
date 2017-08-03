// Initializes the `resource_data` service on path `/resource-data`
const createService = require('feathers-nedb');
const createModel = require('../../models/resource-data.model');
const hooks = require('./resource-data.hooks');
const filters = require('./resource-data.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'resource-data',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/resource-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('resource-data');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
