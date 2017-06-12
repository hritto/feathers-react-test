// Application hooks that run for every service
const logger = require('./hooks/logger');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      function(hook) {
        debugger;
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        if (!hook.data.uri && hook.params.file){
            const file = hook.params.file;
            const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
            hook.data = {uri: uri};
        }
    }],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
