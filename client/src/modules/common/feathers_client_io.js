
const socket = io(serverUrl);
const app = feathers()
.configure(feathers.hooks())
.configure(feathers.socketio(socket));
const uploadService = app.service('uploads');

export default uploadService;