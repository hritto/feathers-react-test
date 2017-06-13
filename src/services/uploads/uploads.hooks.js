const dauria = require('dauria');
const Promise = require("bluebird");
const Hooks = require('./hooks.js');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      function(hook) {
        Hooks.beforeCreateHook(hook)
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [function(hook) {
      Hooks.afterCreateHook(hook)
    }],
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
