const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');
const hooks = require('./resources.hooks');
const path = require("path");
const Hooks = require('./hooks.js');

// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
//The path
const blobStorage = fs(path.join(__dirname, '..', '..', '..', 'public', 'resources'));

module.exports = function () {
  const app = this;
  // Initialize our service with any options it requires
  app.use('/resources',

    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        mimetype = req.file.mimetype;
        next();
    },
    blobService({Model: blobStorage})
);

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('resources');

  service.hooks(hooks);

};
