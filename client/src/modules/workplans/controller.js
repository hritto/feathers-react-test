const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import client from '../common/client.js';
import R from 'ramda'

const WorkPlansController = function () {
  let options = null;
  let model = null;
  let sb = null;
  let workplansService = null;
  const feathersClient = feathers().configure(feathers.rest(serverUrl).fetch(fetch));

  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    workplansService = feathersClient.service('/workplans');

    ResponsiveHelper();
    return workplansService.find().then(results => {
      let combo_constructors = model.get(['config', 'combo_constructors']);
      if (combo_constructors && combo_constructors.length) {
        //Cargar los datos de los combos
        return setComboConstructors(combo_constructors).then(function () {
          model.set('records', results.data, true);
        });
      } else {
        model.set('records', results.data, true);
      }
    });
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
    let combo_constructors = model.get(['config', 'combo_constructors']);
    let selected_record = {};
    //ver si hay que cargar combos/datos
    if (combo_constructors && combo_constructors.length) {
      //Cargar los datos de los combos
      return setComboConstructors(combo_constructors).then(function () {
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
    return workplansService.find({
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

  const doCreate = (selected_record) => {
    // Guarda los datos del recurso cuando no es un upload...
    let meta = {
      name: selected_record.name,
      description: selected_record.description,
      level: selected_record.level,
      published: selected_record.published,
      capacity: selected_record.capacity,
      cognitive_process: selected_record.cognitive_process,
      competence: selected_record.competence,
    };
    return Promise.all([
      workplansService.create(meta)
    ]).then(result => {
      if (result && result.length) {
        //Recargar los datos
        let msg = 'El plan se ha creado correctamente';
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

  const doDelete = (selected_record) => {
    if (!selected_record._id) {
      model.set('message', 'Error occurred: No data');
      resetState();
      return;
    }
    const resource_id = selected_record._id;
    return Promise.all([
      workplansService.remove(resource_id, {}),
    ]).then(results => {
      if (results && results.length) {
        //Recargar los datos
        let msg = 'El plan se ha borrado correctamente';
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
    return workplansService.find().then(results => {
      let combo_constructors = model.get(['config', 'combo_constructors']);
      if (combo_constructors && combo_constructors.length) {
        //Cargar los datos de los combos
        return setComboConstructors(combo_constructors).then(function () {
          model.set('records', results.data, true);
          setSelectedRecord(null, null, false);
          if (msg) {
            model.set('message', msg, true);
          }
          resetState();
        });
      } else {
        model.set('records', results.data, true);
        if (msg) {
          model.set('message', msg, true);
        }
        resetState();
      }
    });
  }

  const doUpdate = (record) => {
    const selected_record = record;
    if (!selected_record) {
      return;
    }

    let resource_id = selected_record._id;
    let metadata = {
      name: selected_record.name,
      description: selected_record.description,
      level: selected_record.level,
      published: selected_record.published,
      capacity: selected_record.capacity,
      cognitive_process: selected_record.cognitive_process,
      competence: selected_record.competence,
    };

    return Promise.all([
      workplansService.patch(resource_id, metadata, {}),
    ]).then(results => {
      if (results && results.length) {
        let message = 'El plan se ha actualizado correctamente';
        loadResources(message);
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

  const resourceUploaded = function () {
    let message = 'El plan se ha cargado correctamente';
    loadResources(message);
  };

  const resetState = () => {
    model.set('selected_record', null, false);
    model.set('state', 'initial', true);
    window.dispatchEvent(new Event('resize'));
    if (model.get('message') && model.get('message') !== '') {
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
        instanceIds: ["PreviewResource"]
      },
      current: null,
      options: opts
    });
  };

  const getActiveIndex = () => {
    return model.get('active_index');
  };

  const setActiveIndex = (index) => {
    model.set('active_index', index, true);
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
    resourceUploaded: resourceUploaded,
    getActiveIndex: getActiveIndex,
    setActiveIndex: setActiveIndex,
    destroy: destroy
  };
};

export default WorkPlansController;
