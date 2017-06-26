
const feathersClient = feathers().configure(feathers.rest(serverUrl).fetch(fetch));
const users = feathersClient.service('/users');
const media = feathersClient.service('/media');
const activities = feathersClient.service('/activities');
const activityCode = feathersClient.service('/activity-code');

const feathers_services = {
    users: users,
    media: media,
    activities: activities,
    activityCode: activityCode
};

export default feathers_services;