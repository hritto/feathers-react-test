const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import R from 'ramda'

const UsersController = function() {
  let options = null;
  let model = null;
  let sb = null;
  const feathersClient = feathers().configure(feathers.rest(serverUrl).fetch(fetch));
  const users = feathersClient.service('/users');
  const media = feathersClient.service('/media');

  const addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

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
          return fn[func]().then(function(val){
            if(val && val.data){
              model.set(['config','combo_values', val.name], val.data, false);
            }
          });
        });
        return resolve();
      }).then(function(){
        setSelectedRecord(opts, model.getVoidRecord(), false);
        model.set('state', opts.action, true);
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
    return users.find({ query: { _id: opts.id } }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
      return media.find({ query: { type: 'avatar' } }).then(results => {
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
    model.set('state', 'initial', true);
  };

  const handleCancel = () => {
    model.set('state', 'initial', true);
  };

  const handleSubmit = (data) => {
    //Validacion: TODO
    let is_valid = true;
    if(is_valid){
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
    }

  };

  const doUpdate = (data) => {
    Promise.all([
      users.update(data._id, data, {}),
    ]).then(results => {
        if(results && results.length){
          let index = R.findIndex(R.propEq('_id', results[0]._id))(model.get('records')); //=> 1
          model.setRecord(index, results[0]);
        } else {
          //TODO: mensaje de error de servidor
        }
    }).catch(err => {
      //TODO: mensaje de error de servidor
      console.log('Error occurred:', err)
    });
    closeModal();
    model.set('selected_record', null, false);
  };

  const doDelete = (data) => {
    Promise.all([
      users.remove(data._id, { query: { _id: data._id }})
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

  const doCreate = (data) => {
    delete data._id;
    Promise.all([
      users.create(data),
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

  const avatarSelected = (opts) => {
    debugger;
    model.set(['selected_record','photo'], opts.url, true);
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
    destroy: destroy
  };
};

export default UsersController;
