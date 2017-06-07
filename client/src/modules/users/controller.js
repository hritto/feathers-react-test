const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';

const UsersController = function() {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    const feathersClient = feathers()
        .configure(feathers.rest(serverUrl).fetch(fetch))
    const users = feathersClient.service('/users');
    /*
    Promise.all([
      users.create({ email: '2jane.doe@gmail.com', password: '11111', role: 'admin' }),
      users.create({ email: '2john.doe@gmail.com', password: '22222', role: 'user' }),
      users.create({ email: '2judy.doe@gmail.com', password: '33333', role: 'user' })
    ]).then(results => {
        console.log('created Jane Doe item\n', results[0]);
        console.log('created John Doe item\n', results[1]);
        console.log('created Judy Doe item\n', results[2]);
        return users.find().then(results => console.log('find all items\n', results));
    }).catch(err => console.log('Error occurred:', err));
    */

    return users.find().then(results => {
      model.set('records', results.data, true);

    });
  };

  const itemClick = (opts) => {
    model.set('selected_record_id', opts.id, false);
    model.set('state', opts.action, true);
  };

  const closeModal = () => {
    model.set('state', 'initial', true);
  };

  const actionModal = () => {
    let action = model.get('state');
    switch (model.get('state')) {
      case 'delete':

        break;
      default:

    }
    model.set('state', 'initial', true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Validacion

    closeModal();
  };

  const handleChange = (e) => {
    model.set(['form', e.target.name], e.target.value, true);
  };


  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    itemClick: itemClick,
    closeModal: closeModal,
    actionModal: actionModal,
    handleSubmit: handleSubmit,
    handleChange: handleChange,
    destroy: destroy
  };
};

export default UsersController;
