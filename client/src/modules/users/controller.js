const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import R from 'ramda'

const UsersController = function() {
  let options = null;
  let model = null;
  let sb = null;
  const feathersClient = feathers().configure(feathers.rest(serverUrl).fetch(fetch));
  const users = feathersClient.service('/users');


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();

    //.update()
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
    let combo_constructors = model.get(['config','combo_constructors']);
    let selected_record = {};
    let promiseCombos = {};

    if(opts.action === 'update'|| opts.action === 'create'){
      //ver si hay que cargar combos/datos
      if (combo_constructors && combo_constructors.length){
        //Cargar los datos de los combos
        promiseCombos = new Promise(function(resolve, reject){
          _.map(combo_constructors, function (fn, i, obj) {
            let func = Object.keys(fn)[0];
            return fn[func]().then(function(val){
              if(val && val.data){
                model.set(['config','combo_values', val.data.name], val.data, false);
              }
            });
          });
        });
        if(opts.id){
          selected_record = R.find(R.propEq('_id', opts.id))(model.get('records'));
        } else {
          selected_record = model.getVoidRecord();
        }
        //Ya tenemos todos los datos, cambiar el estado
        model.set('selected_record', selected_record, false);
        model.set('state', opts.action, true);
      } else {
        if(opts.id){
          selected_record = R.find(R.propEq('_id', opts.id))(model.get('records'));
        } else {
          selected_record = model.getVoidRecord();
        }
        //Ya tenemos todos los datos, cambiar el estado
        model.set('selected_record', selected_record, false);
        model.set('state', opts.action, true);
      }
    }
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

  const handleSubmit = (data) => {

    //Validacion: TODO
    let valid = true;

    if(valid){
      Promise.all([
        users.update(data._id, data, {}),
      ]).then(results => {
          return users.find().then(results => {
            model.set('records', results.data, true);
          });
      }).catch(err => {
        //TODO: mensaje de error de servidor
        console.log('Error occurred:', err)
      });
    } else {
      //TODO: mensaje de error de formulario
    }
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
