const dauria = require('dauria');
const Promise = require("bluebird");
const fs = require('fs');
const unzip = require('unzip');
const path = require("path");
//const yauzl = require("yauzl");

module.exports = {
  beforeCreateHook: function (hook) {
    if (!hook.data.uri && hook.params.file) {
      const file = hook.params.file;
      const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);

      //console.log(uri)
      hook.data = {
        uri: uri,
        mediatype: hook.data.mediatype,
        name: hook.data.name,
        description: hook.data.description,
        level: hook.data.level,
        resource_type: hook.data.resource_type,
        published: hook.data.published,
        competence: hook.data.competence,
        cognitive_process: hook.data.cognitive_process,
        capacity: hook.data.capacity,
      };
    }
  },
  afterCreateHook: function (hook) {
    //The paths
    const file_name = hook.result.id;
    const input_dir = path.join(__dirname, '..', '..', '..', 'public', 'resources', file_name);
    const folder_name = file_name.substr(0, file_name.length - 4);
    const ouput_dir = path.join(__dirname, '..', '..', '..', 'public', 'resources', folder_name);
    // Una vez creado el fichero,
    // guardamos los datos de la nueva imagen en la BBDD
    Promise.all([
      hook.app.service('resource-data').create({
        url: ouput_dir,
        mediatype: hook.data.mediatype,
        name: hook.data.name,
        description: hook.data.description,
        level: hook.data.level,
        resource_type: hook.data.resource_type,
        published: hook.data.published,
        competence: hook.data.competence,
        cognitive_process: hook.data.cognitive_process,
        capacity: hook.data.capacity,
        original_name: hook.params.file.originalname,
      }),
    ]).then(results => {
      if (results && results.length) {
        fs.createReadStream(input_dir).pipe(unzip.Extract({ path: ouput_dir })).on('close', function (entry) {
          // Borrar el zip original
          // Cambiar el nombre al fichero
          fs.unlink(input_dir, (err) => {
            if (err) throw err;
            console.log('successfully deleted');
          });
        });
      }
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
    });

  },
  isZipFile: function (mime) {
    const zipFiles = ['zip'];
    if (mime) {
      return (new RegExp('(' + zipFiles.join('|').replace(/\./g, '\\.') + ')$')).test(mime);
    }
  },

}
