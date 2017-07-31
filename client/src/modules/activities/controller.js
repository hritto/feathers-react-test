const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import feathersServices from '../common/feathers_client';
import R from 'ramda'

const ActivitiesController = function () {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    return feathersServices.activities.find().then(results => {
      let combo_constructors = model.get(['config', 'combo_constructors']);
      if (combo_constructors && combo_constructors.length) {
        //Cargar los datos de los combos
        return new Promise(function (resolve, reject) {
          _.map(combo_constructors, function (fn, i, obj) {
            let func = Object.keys(fn)[0];
            return fn[func]().then(function (val) {
              if (val && val.data) {
                model.set(['config', 'combo_values', val.name], val.data, false);
              }
            });
          });
          return resolve();
        }).then(function(){
          model.set('records', results.data, true);
        });
      } else {
        model.set('records', results.data, true);
      }
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
    if (opts.action === 'update') {
      updClick(opts);
    }

    if (opts.action === 'create') {
      addClick(opts);
    }

    if (opts.action === 'delete') {
      setSelectedRecord(opts, getLocalRecord(opts), false);
      model.set('state', opts.action, true);
    }
  };

  const addClick = () => {
    model.set('state', 'create', false);
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
        setSelectedRecord(null, model.getVoidRecord(), true);
      });
    } else {
      setSelectedRecord(null, model.getVoidRecord(), true);
    }
  };

  const updClick = (opts) => {
    let combo_constructors = model.get(['config', 'combo_constructors']);
    let selected_record = {};
    if (!opts.id) {
      closeModal();
      return;
    }
    //ver si hay que cargar combos/datos
    if (combo_constructors && combo_constructors.length) {
      //Cargar los datos de los combos
      return new Promise(function (resolve, reject) {
        _.map(combo_constructors, function (fn, i, obj) {
          let func = Object.keys(fn)[0];
          return fn[func]().then(function (val) {
            if (val && val.data) {
              model.set(['config', 'combo_values', val.name], val.data, false);
            }
          });
        });
        return resolve();
      }).then(function () {
        getRemoteRecord(opts);
      });
    } else {
      getRemoteRecord(opts);
    }
  };

  const getRemoteRecord = (opts) => {
    return feathersServices.activities.find({
      query: {
        _id: opts.id
      }
    }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
      return feathersServices.activityCode.find({
        query: {
          _id: results.data[0].code_id
        }
      }).then(code => {
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
    model.set('selected_record', record, dispatch);
  };

  const closeModal = () => {
    model.resetFieldsState();
    model.set('state', 'initial', true);
  };

  const handleCancel = () => {
    model.resetFieldsState();
    model.set('state', 'initial', true);
  };

  const tabClick = (view) => {
    model.set('tab', view, true);
  };

  const updateActivityCode = (data) => {
    model.set('activity_code', data, false);
  };

  const updateActivityMetadata = (data) => {
    model.set(['selected_record','name'], data.name, false);
    model.set(['selected_record','activity_type'], data.activity_type, false);
    model.set(['selected_record','level'], data.level, false);
    model.set(['selected_record','published'], data.published, false);
    model.set(['selected_record','capacity'], data.capacity, false);
    model.set(['selected_record','cognitive_process'], data.cognitive_process, false);
    model.set(['selected_record','competence'], data.competence, true);
  };

  const setElementData = (data) => {
    model.set(data.lens, data.value, data.dispatch);
  };

  const createActivity = (metadata, code) => {
    let meta = {
      name: metadata.name,
      activity_type: metadata.activity_type,
      level: metadata.level,
      published: metadata.published,
      capacity: metadata.capacity,
      cognitive_process: metadata.cognitive_process,
      competence: metadata.competence,
      code_id: null
    };
    if(!code){
      return;
    }
    code = {
      code: JSON.stringify(code)
    };
    return Promise.all([
      feathersServices.activityCode.create(code)
    ]).then(data => {
      if(data && data.length){
        meta.code_id = data[0]._id;
        return Promise.all([
          feathersServices.activities.create(meta)
        ]).then(result => {
          //Recargar los datos
          return feathersServices.activities.find().then(results => {
            let combo_constructors = model.get(['config', 'combo_constructors']);
            if (combo_constructors && combo_constructors.length) {
              //Cargar los datos de los combos
              return new Promise(function (resolve, reject) {
                _.map(combo_constructors, function (fn, i, obj) {
                  let func = Object.keys(fn)[0];
                  return fn[func]().then(function (val) {
                    if (val && val.data) {
                      model.set(['config', 'combo_values', val.name], val.data, false);
                    }
                  });
                });
                return resolve();
              }).then(function(){
                model.set('records', results.data, true);
                model.setSelectedRecord(null);
                resetState();
              });
            } else {
              model.set('records', results.data, true);
              resetState();
            }
          });
        });
      } else {
        model.set('message', 'Error occurred: no data');
        resetState();
      }
    }).catch(err => {
      model.set('message', 'Error occurred:' + err);
      resetState();
    });
  };

  const updateCode = () => {
    const selected_record = model.get('selected_record');
    if(!selected_record){
      return;
    }
    let data = model.get('activity_code');
    let activity_id = selected_record._id;
    let metadata = {
      name: selected_record.name,
      activity_type: selected_record.activity_type,
      level: selected_record.level,
      published: selected_record.published,
      capacity: selected_record.capacity,
      cognitive_process: selected_record.cognitive_process,
      competence: selected_record.competence,
      code_id: selected_record.code_id
    };

    if(data){
      data = {
        code: JSON.stringify(data)
      };
    }
    const id = selected_record.code_id;
    return Promise.all([
      feathersServices.activityCode.update(id, data, {}),
      feathersServices.activities.update(activity_id, metadata, {}),
    ]).then(results => {
        if(results && results.length){
          const obj = JSON.parse(results[0].code);
          model.set('activity_code', obj, false);
          updateActivityMetadata(results[1]);
          let index = R.findIndex(R.propEq('_id', results[1]._id))(model.get('records')); //=> 1
          model.setRecord(index, results[1]);
          model.set('message', 'La actividad se ha actualizado correctamente');
          resetState();
        } else {
          model.set('message', 'Error occurred: no data');
          resetState();
        }
    }).catch(err => {
      model.set('message', 'Error occurred:' + err);
      resetState();
    });
  };

  const resetState = () => {
    model.set('selected_record', null, false);
    model.set('state', 'initial', true);
    window.dispatchEvent(new Event('resize'));
    if (model.get('message') && model.get('message') !== ''){
      setTimeout(() => {
        model.set('message', '', true);
      }, 4000);
    }
  };

  const setMediaFilterRecords = (records) => {
    model.set('media_filter_records', records, true);
  };

  const setMediaFilterPage = (next_skip) => {
    model.set(['media_filter_pagination', 'skip'], next_skip, false);
  };

  const getMediaFilterRecords = (filter, mediatype, sk) => {
    let skip = model.get(['media_filter_pagination', 'skip']);
    if (sk === 'filter'){
      skip = 0;
    }

    let query = {
      query: {
        $skip: skip,
        mediatype: mediatype
      }
    }
    if (filter.name) {
      query.query['name'] = {
        $search: [filter.name]
      };
    }
    if (filter.original_name) {
      query.query['original_name'] = {
        $search: [filter.original_name]
      };
    }
    if (filter.description) {
      query.query['description'] = {
        $search: [filter.description]
      };
    }

    return feathersServices.media.find(query).then(results => {
      if(results && results.data){
        model.set('media_filter_records', results.data, false);
        model.set('media_filter_pagination', {
          skip: results.skip,
          total: results.total,
          limit: results.limit,
        }, true);
      } else {
        // TODO: mensaje de error del servidor
        console.log('error');
      }
    });
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    itemClick: itemClick,
    closeModal: closeModal,
    handleCancel: handleCancel,
    tabClick: tabClick,
    updateActivityCode: updateActivityCode,
    updateActivityMetadata: updateActivityMetadata,
    setElementData: setElementData,
    updateCode: updateCode,
    createActivity: createActivity,
    setMediaFilterRecords: setMediaFilterRecords,
    getMediaFilterRecords: getMediaFilterRecords,
    setMediaFilterPage: setMediaFilterPage,
    resetState: resetState,
    addClick: addClick,
    destroy: destroy
  };
};

export default ActivitiesController;
