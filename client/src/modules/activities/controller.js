const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import feathersServices from '../common/feathers_client';

const ActivitiesController = function() {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    return feathersServices.activities.find().then(results => {
      model.set('records', results.data, true);
    });
    /*
    //Seed
    var act_data = {
      name: 'Actividad Test',
      activity_type:'click',
      level: 1,
      published: true,
      code_id: '6IZHe1gFlVfWvBbn' 
    };
    Promise.all([
        feathersServices.activities.create(act_data),
      ]).then(results => {
          console.log('created Jane Doe item\n', results[0]);
          return feathersServices.activities.find().then(results => console.log('find all items\n', results));
      }).catch(err => console.log('Error occurred:', err));
    */
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
    /*
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
    */
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
    return feathersServices.activities.find({ query: { _id: opts.id } }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
      return feathersServices.activityCode.find({ query: { _id: results.data[0].id } }).then(code => {
        const obj = JSON.parse(code.data[0].code);
        
        model.set('activity_code', obj, false);
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
      /*
      if(model.get('state') === 'create'){
        doCreate(data);
      }
      if(model.get('state') === 'delete'){
        doDelete(data);
      }
      */
    } else {
    //TODO: mensaje de error de formulario
    model.set('state', model.get('state'), true);
    }
  };

  const tabClick = (view) => {
    model.set('tab', view, true);
  }

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    itemClick: itemClick,
    closeModal: closeModal,
    handleCancel: handleCancel,
    handleSubmit: handleSubmit,
    tabClick: tabClick,
    destroy: destroy
  };
};

export default ActivitiesController;
