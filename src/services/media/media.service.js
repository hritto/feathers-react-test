// Initializes the `media` service on path `/media`
const createService = require('feathers-nedb');
const createModel = require('../../models/media.model');
const hooks = require('./media.hooks');
const filters = require('./media.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  //const paginate = app.get('paginate');
  const paginate = {
      default: 15,
      max: 15
    };

  const options = {
    name: 'media',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/media', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('media');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
