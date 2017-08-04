const dauria = require('dauria');
const Promise = require("bluebird");
const fs = require('fs');
const unzip = require('unzip2');
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
    const output_dir = path.join(__dirname, '..', '..', '..', 'public', 'resources', folder_name);
    let data_options = {
      url: '',
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
    };
    // Una vez creado el fichero, los descomprimimos
    fs.createReadStream(input_dir).pipe(unzip.Extract({
      path: output_dir
    })).on('close', function (entry) {
      // Borrar el zip original
      fs.unlink(input_dir, (err) => {
        if (err) throw err;
        // console.log('successfully deleted');
        fs.readdir(output_dir, function (err, files) {
          if (err) {
            throw err;
          }
          // buscar el index.html dentro del directorio
          files.map(function (file) {
            if (file === 'index.html') {
              data_options.url = folder_name + "/" + file;
              Promise.all([
                hook.app.service('resource-data').create(data_options),
              ]).catch(err => {
                //TODO: mensaje de error de servidor
                console.log('Error occurred:', err)
              });
            }
          });
          // No hemos encontrado el index en el primer nivel
          if (data_options.url === '') {
            files.map(function (file2) {
              if (file2 !== '__MACOSX') {
                let inner_dir = path.join(output_dir, file2);
                if (fs.statSync(inner_dir).isDirectory()) {
                  fs.readdir(inner_dir, function (err, inner_files) {
                    if (err) throw err;
                    // buscar el index.html dentro del sub directorio
                    inner_files.map(function (inner_file) {
                      if (inner_file === 'index.html') {
                        //console.log("Founded index 2");
                        data_options.url = folder_name + "/" + file2 + "/" + inner_file;
                        Promise.all([
                          hook.app.service('resource-data').create(data_options),
                        ]).catch(err => {
                          //TODO: mensaje de error de servidor
                          console.log('Error occurred:', err);
                          alert("Archivo comprimido inválido...");
                        });
                      }
                    });
                  });
                }
              }
            });
          }
          if (data_options.url === '') {
            
          }
        });
      });
    });
  },
  isZipFile: function (mime) {
    const zipFiles = ['zip'];
    if (mime) {
      return (new RegExp('(' + zipFiles.join('|').replace(/\./g, '\\.') + ')$')).test(mime);
    }
  },

}
