const users = require('./users/users.service.js');
const uploads = require('./uploads/uploads.service.js');
const media = require('./media/media.service.js');
const activities = require('./activities/activities.service.js');
const activityCode = require('./activity-code/activity-code.service.js');
const resources = require('./resources/resources.service.js');
const resourceData = require('./resource-data/resource-data.service.js');
const workplans = require('./workplans/workplans.service.js');
const workplansItems = require('./workplans-items/workplans-items.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(uploads);
  app.configure(media);
  app.configure(activities);
  app.configure(activityCode);
  app.configure(resources);
  app.configure(resourceData);
  app.configure(workplans);
  app.configure(workplansItems);
};
