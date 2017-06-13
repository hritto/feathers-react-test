const users = require('./users/users.service.js');
const uploads = require('./uploads/uploads.service.js');
const media = require('./media/media.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(uploads);
  app.configure(media);
};
