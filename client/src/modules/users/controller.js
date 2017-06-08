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
    return users.find().then(results => {
      model.set('records', results.data, true);
    });
  };

  const itemClick = (opts) => {
    let combo_constructors = model.get(['config','combo_constructors']);
    let selected_record = {};

    if(opts.action === 'update'){
      if(!opts.id){
        closeModal();
        return;
      }
      //ver si hay que cargar combos/datos
      if (combo_constructors && combo_constructors.length){
        //Cargar los datos de los combos
        return new Promise(function(resolve, reject){
          _.map(combo_constructors, function (fn, i, obj) {
            let func = Object.keys(fn)[0];
            return fn[func]().then(function(val){
              if(val && val.data){
                model.set(['config','combo_values', val.data.name], val.data, false);
              }
            });
          });
          return resolve();
        }).then(function(){
          getRemoteRecord(opts);
        });
      } else {
        getRemoteRecord(opts);
      }
    }

    if(opts.action === 'create'){
      setSelectedRecord(opts, model.getVoidRecord(), true)
    }

    if(opts.action === 'delete'){
      setSelectedRecord(opts, getLocalRecord(opts), true)
    }
  };

  const getRemoteRecord = (opts) => {
    return users.find({ query: { _id: opts.id } }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
    });
  };

  const getLocalRecord = (opts) => {
    return R.find(R.propEq('_id', opts.id))(model.get('records'));
  };

  const setSelectedRecord = (opts, record, dispatch) => {
    model.set('selected_record', record, false);
    model.set('state', opts.action, dispatch);
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
    let is_valid = true;
    if(is_valid){
      if(model.get('state') === 'update'){
        doUpdate(data);
      }
    } else {
    //TODO: mensaje de error de formulario
    }

  };

  const doUpdate = (data) => {
    Promise.all([
      users.update(data._id, data, {}),
    ]).then(results => {
      debugger;
      //Actualizar el record en el modelo!!!!!!!!!!!!!!!
        return users.find().then(results => {
          model.set('records', results.data, true);
        });
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
    });
    closeModal();
    model.set('selected_record', null, false);
  };

  const doDelete = (data) => {
    Promise.all([
      users.delete(data._id),
    ]).then(results => {
        return users.find().then(results => {
          model.set('records', results.data, true);
        });
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
    });
    closeModal();
    model.set('selected_record', null, false);
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
    destroy: destroy
  };
};

export default UsersController;
