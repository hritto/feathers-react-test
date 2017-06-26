const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import Validators from '../common/validators.js';
import R from 'ramda'
import feathersServices from '../common/feathers_client';


const UsersController = function() {
  let options = null;
  let model = null;
  let sb = null;
/*
  const feathersClient = feathers().configure(feathers.rest(serverUrl).fetch(fetch));
  const users = feathersClient.service('/users');
  const media = feathersClient.service('/media');
*/
  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    return feathersServices.users.find().then(results => {
      model.set('records', results.data, true);
    });
  };

  const itemClick = (opts) => {
    if(opts.action === 'update'){
      updClick(opts);
    }

    if(opts.action === 'create'){
      addClick(opts);
    }

    if(opts.action === 'delete'){
      setSelectedRecord(opts, getLocalRecord(opts), false);
      model.set('state', opts.action, true);
    }
  };

  const addClick = (opts) => {
    let combo_constructors = model.get(['config','combo_constructors']);
    let selected_record = {};
    //ver si hay que cargar combos/datos
    if (combo_constructors && combo_constructors.length){
      //Cargar los datos de los combos
      return new Promise(function(resolve, reject){
        _.map(combo_constructors, function (fn, i, obj) {
          let func = Object.keys(fn)[0];
          //EL inicializados de los combos siempre es un promise
          return fn[func]().then(function(val){
            if(val && val.data){
              model.set(['config','combo_values', val.name], val.data, false);
            }
          });
        });
        return resolve();
      }).then(function(){
        setSelectedRecord(opts, model.getVoidRecord(), false);
        return feathersServices.media.find({ query: { mediatype: "avatar", "$limit": 100, } }).then(results => {
          model.set('avatars', results.data, false);
          model.set('state', opts.action, true);
        });
      });
    } else {
      setSelectedRecord(opts, model.getVoidRecord(), false);
      model.set('state', opts.action, true);
    }
  };

  const updClick = (opts) => {
    let combo_constructors = model.get(['config','combo_constructors']);
    let selected_record = {};

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
              model.set(['config','combo_values', val.name], val.data, false);
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
  };

  const getRemoteRecord = (opts) => {
    return feathersServices.users.find({ query: { _id: opts.id } }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
      return feathersServices.media.find({ query: { mediatype: "avatar", "$limit": 100, } }).then(results => {
        model.set('avatars', results.data, false);
        model.set('state', opts.action, true);
      });
    });
  };

  const getLocalRecord = (opts) => {
    return R.find(R.propEq('_id', opts.id))(model.get('records'));
  };

  const setSelectedRecord = (opts, record, dispatch) => {
    model.set('selected_record', record, false);
  };

  const closeModal = () => {
    model.resetFieldsState();
    model.set('state', 'initial', true);
  };

  const handleCancel = () => {
    model.resetFieldsState();
    model.set('state', 'initial', true);
  };

  const handleSubmit = (data) => {
    if( validateFields(data) ){
      if(model.get('state') === 'update'){
        doUpdate(data);
      }
      if(model.get('state') === 'create'){
        doCreate(data);
      }
      if(model.get('state') === 'delete'){
        doDelete(data);
      }
    } else {
    //TODO: mensaje de error de formulario
    model.set('state', model.get('state'), true);
    }
  };

  const validateFields = (data) => {
    let is_valid = true;
    let config_fields = model.get(['config', 'fields']);
    _.map(data, function(field, key){
      let config = R.find(R.propEq('name', key))(config_fields)
      if(!Validators.validateField(field, name, config)){
        is_valid = false;
        model.setFieldState(key, 'error');
      } else {
        model.setFieldState(key, 'initial');
      }
    })
    return is_valid;
  };

  const doUpdate = (data) => {
    if(data.active_tab){
      delete data.active_tab;
    }
    return Promise.all([
      feathersServices.users.update(data._id, data, {}),
    ]).then(results => {
        if(results && results.length){
          let index = R.findIndex(R.propEq('_id', results[0]._id))(model.get('records')); //=> 1
          model.setRecord(index, results[0]);
          resetState();
        } else {
          //TODO: mensaje de error de servidor
          resetState();
        }
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
      resetState();
    });
  };

  const doDelete = (data) => {
    Promise.all([
      users.remove(data._id, { query: { _id: data._id }})
    ]).then(results => {
        return feathersServices.users.find().then(results => {
          model.set('records', results.data, true);
          resetState();
        });
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
      resetState();
    });

  };

  const doCreate = (data) => {
    delete data._id;
    if(data.active_tab){
      delete data.active_tab;
    }
    Promise.all([
      feathersServices.users.create(data),
    ]).then(results => {
        return feathersServices.users.find().then(results => {
          model.set('records', results.data, true);
          resetState();
        });
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
      resetState();
    });
  };

  const resetState = () => {
    closeModal();
    model.set('selected_record', null, false);
  };

  const addNewAvatar = (file) => {
    model.append('avatars', file);
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    itemClick: itemClick,
    closeModal: closeModal,
    handleCancel: handleCancel,
    handleSubmit: handleSubmit,
    addNewAvatar: addNewAvatar,
    destroy: destroy
  };
};

export default UsersController;
