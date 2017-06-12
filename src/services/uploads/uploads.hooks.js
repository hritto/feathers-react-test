const dauria = require('dauria');
const Promise = require("bluebird");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      function(hook) {
        if (!hook.data.uri && hook.params.file){
          const file = hook.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          hook.data = {
            uri: uri,
            user_id: hook.data.user_id
          };
        }
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
      const dir_path = hook.result.id;
      // Una vez creado el fichero, actualizamos el usuario con la imagen
      Promise.all([
        hook.app.service('users').patch(hook.data.user_id, {photo: dir_path}, {}),
      ]).then(results => {
          if(results && results.length){
            console.log(results)
          } else {
            //TODO: mensaje de error de servidor
          }
      }).catch(err => {
        //TODO: mensaje de error de servidor
        console.log('Error occurred:', err)
      });
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
