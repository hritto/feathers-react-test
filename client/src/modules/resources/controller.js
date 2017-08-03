const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import feathersServices from '../common/feathers_client';
import R from 'ramda'

const ResourcesController = function () {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    return feathersServices.resources.find().then(results => {
      let combo_constructors = model.get(['config', 'combo_constructors']);
      if (combo_constructors && combo_constructors.length) {
        //Cargar los datos de los combos
        return setComboConstructors(combo_constructors).then(function(){
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

  const setComboConstructors = (constructors) => {
    return new Promise(function (resolve, reject) {
      _.map(constructors, function (fn, i, obj) {
        let func = Object.keys(fn)[0];
        return fn[func]().then(function (val) {
          if (val && val.data) {
            model.set(['config', 'combo_values', val.name], val.data, false);
          }
        });
      });
      return resolve();
    });
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

  const addClick = (opts) => {
    model.set('state', opts.action, false);
    let combo_constructors = model.get(['config','combo_constructors']);
    let selected_record = {};
    //ver si hay que cargar combos/datos
    if (combo_constructors && combo_constructors.length){
      //Cargar los datos de los combos
      return setComboConstructors(combo_constructors).then(function(){
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
      return setComboConstructors(combo_constructors).then(function () {
        getRemoteRecord(opts);
      });
    } else {
      getRemoteRecord(opts);
    }
  };

  const getRemoteRecord = (opts) => {
    return feathersServices.resources.find({
      query: {
        _id: opts.id
      }
    }).then(results => {
      setSelectedRecord(opts, results.data[0], true);
      model.set('state', opts.action, true);
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
    window.dispatchEvent(new Event('resize'));
  };

  const tabClick = (view) => {
    model.set('tab', view, true);
  };

  const doCreate = (metadata, code) => {
    let meta = {
      name: metadata.name,
      description: metadata.description,
      activity_type: metadata.resource_type,
      level: metadata.level,
      published: metadata.published,
      capacity: metadata.capacity,
      cognitive_process: metadata.cognitive_process,
      competence: metadata.competence,
      url: null
    };
    return Promise.all([
      feathersServices.resources.create(meta)
    ]).then(result => {
      if(result && result.length){
        //Recargar los datos
        let msg = 'El recurso se ha creado correctamente';
        loadResources(msg);
      } else {
        model.set('message', 'Error occurred:' + err);
        resetState();
      }
    }).catch(err => {
      model.set('message', 'Error occurred:' + err);
      resetState();
    });
  };

  const doDelete = (selected_record) => {
    if(!selected_record._id){
      model.set('message', 'Error occurred: No data');
      resetState();
      return;
    }
    const resource_id = selected_record._id;
    return Promise.all([
      feathersServices.resources.remove(resource_id, {}),
    ]).then(results => {
        if(results && results.length){
          //Recargar los datos
          let msg = 'El recurso se ha borrado correctamente';
          loadResources(msg);
        } else {
          model.set('message', 'Error occurred');
          resetState();
        }
    }).catch(err => {
      model.set('message', 'Error occurred:' + err);
      resetState();
    });

  };


  const loadResources = (msg) => {
    //Recargar los datos
    return feathersServices.resources.find().then(results => {
      let combo_constructors = model.get(['config', 'combo_constructors']);
      if (combo_constructors && combo_constructors.length) {
        //Cargar los datos de los combos
        return setComboConstructors(combo_constructors).then(function(){
          model.set('records', results.data, true);
          setSelectedRecord(null, null, false);
          resetState();
        });
      } else {
        model.set('records', results.data, true);
        resetState();
      }
      model.set('message', msg);
    });
  }

  const doUpdate = () => {
    const selected_record = model.get('selected_record');
    if(!selected_record){
      return;
    }
    let resource_id = selected_record._id;
    let metadata = {
      name: selected_record.name,
      description: selected_record.description,
      activity_type: selected_record.resource_type,
      level: selected_record.level,
      published: selected_record.published,
      capacity: selected_record.capacity,
      cognitive_process: selected_record.cognitive_process,
      competence: selected_record.competence,
      url: selected_record.url
    };

    return Promise.all([
      feathersServices.resources.update(resource_id, metadata, {}),
    ]).then(results => {
        if(results && results.length){
          let index = R.findIndex(R.propEq('_id', results[1]._id))(model.get('records')); //=> 1
          model.setRecord(index, results[1]);
          model.set('message', 'El recurso se ha actualizado correctamente');
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


  const previewResource = (opts) => {
    sb.emit("application.startModule", {
      index: 0,
      module: {
        title: "Preview_resource",
        icon: "cloud upload",
        route: "preview_resource",
        permission: "preview_resource",
        modules: ["PreviewResource"],
        dom: ["preview_modal"],
        config: [{}],
        instanceIds: ["Preview_resource"]
      },
      current: null,
      options: opts
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
    doUpdate: doUpdate,
    doCreate: doCreate,
    doDelete: doDelete,
    resetState: resetState,
    addClick: addClick,
    previewResource: previewResource,
    destroy: destroy
  };
};

export default ResourcesController;
