
const socket = io(serverUrl);
const app = feathers()
.configure(feathers.hooks())
.configure(feathers.socketio(socket));
const uploadService = app.service('uploads');
const uploadResourceService = app.service('resources');

const feathers_uploadService = {
    uploadService: uploadService,
    uploadResourceService: uploadResourceService,
};

export default feathers_uploadService;
