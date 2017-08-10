const dauria = require('dauria');
const Promise = require("bluebird");
const fs = require('fs');
const unzip = require('unzip2');
const path = require("path");
//const yauzl = require("yauzl");

module.exports = {
  beforeCreateHook: function (hook) {
    let original_name = '';
    if (!hook.data.uri && hook.params.file) {
      const file = hook.params.file;
      const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
      original_name = hook.params.file.originalname;
      //console.log(uri)
    }
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
      original_name: original_name,
    };
  },
  afterCreateHook: function (hook) {
    //The paths
    const file_name = hook.result.id;
    const input_dir = path.join(__dirname, '..', '..', '..', 'public', 'resources', file_name);
    const folder_name = file_name.substr(0, file_name.length - 4);
    const output_dir = path.join(__dirname, '..', '..', '..', 'public', 'resources', folder_name);
    let data_options = {
      url: hook.data.url || '',
      mediatype: hook.data.mediatype,
      name: hook.data.name,
      description: hook.data.description,
      level: parseInt(hook.data.level, 10),
      resource_type: parseInt(hook.data.resource_type, 10),
      published: hook.data.published,
      competence: parseInt(hook.data.competence, 10),
      cognitive_process: parseInt(hook.data.cognitive_process, 10),
      capacity: parseInt(hook.data.capacity, 10),
      original_name: hook.data.original_name,
      folder_name: folder_name
    };
    // Una vez creado el fichero, los descomprimimos
    fs.createReadStream(input_dir).pipe(unzip.Extract({
      path: output_dir
    })).on('close', function (entry) {
      // Borrar el zip original
      fs.unlink(input_dir, (err) => {
        if (err) throw err;
        //console.log("***********************************");
        //console.log(parseInt(hook.data.resource_type, 10));
        if (parseInt(hook.data.resource_type, 10) === 0 ||
            parseInt(hook.data.resource_type, 10) === 1 ||
            parseInt(hook.data.resource_type, 10) === 4 ||
            parseInt(hook.data.resource_type, 10) === 5) {
          // Si es un recurso de tipo upload, buscar el index
          fs.readdir(output_dir, function (err, files) {
            if (err) throw err;
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
                            alert("Fichero comprimido inválido...");
                          });
                        }
                      });
                    });
                  }
                }
              });
            } else {
              //data_options.url = folder_name;
              Promise.all([
                hook.app.service('resource-data').create(data_options),
              ]).catch(err => {
                //TODO: mensaje de error de servidor
                console.log('Error occurred:', err)
                alert("Fichero inválido...");
              });
            }
          });
        }
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
