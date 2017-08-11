const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');

const workplanItemsSchema = {
  include: {
    service: 'workplans-items',
    nameAs: 'items',
    parentField: '_id',
    childField: 'planId'
  }
};

module.exports = {
  before: {
    all: [ /*authenticate('jwt')*/ ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      populate({ schema: workplanItemsSchema })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
