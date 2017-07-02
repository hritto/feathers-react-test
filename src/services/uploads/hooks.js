const dauria = require('dauria');
const Promise = require("bluebird");

module.exports = {
  beforeCreateHook: function (hook) {
    if (!hook.data.uri && hook.params.file) {
      const file = hook.params.file;
      const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
      hook.data = {
        uri: uri,
        user_id: hook.data.user_id,
        mediatype: hook.data.mediatype,
        name: hook.data.name,
        description: hook.data.description,
      };
    }
  },
  afterCreateHook: function (hook) {
    const dir_path = '/uploads/media/' + hook.result.id;
    // Una vez creado el fichero,
    // guardamos los datos de la nueva imagen en la BBDD
    Promise.all([
      //hook.app.service('users').patch(hook.data.user_id, {photo: dir_path}, {}),
      hook.app.service('media').create({
        url: dir_path,
        original_name: hook.params.file.originalname,
        mediatype: hook.data.mediatype,
        name: hook.data.name,
        description: hook.data.description,
      }),
    ]).then(results => {
      if (results && results.length) {
        //console.log(results)
      }
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
    });

  },
  isImageFile: function (mime) {
    const imgFiles = ['jpg', 'png', 'gif'];
    if (mime) {
      return (new RegExp('(' + imgFiles.join('|').replace(/\./g, '\\.') + ')$')).test(mime);
    }
  },

}
