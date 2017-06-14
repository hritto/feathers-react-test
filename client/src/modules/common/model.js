import signals from 'signals';
import R from 'ramda';

const Model = (data) => {

  let appState = R.clone(data);

  const on = {
    changed: new signals.Signal()
  };

  const initialize = function() {
    dispatchChanged();
  };

  const get = (prop) => {
    let lens = R.type(prop) === "Array" ? R.lensPath(prop) : R.lensProp(prop);
    return R.view(lens, appState);
  };

  const set = (prop, value, dispatch) => {
    let lens = R.type(prop) === "Array" ? R.lensPath(prop) : R.lensProp(prop);
    appState = R.set(lens, value, appState);
    if(dispatch){
      dispatchChanged();
    }
  };

  const setRecord = (index, data) => {
    appState.records = R.update(index,  data, appState.records);
    dispatchChanged();
  };

  const getVoidRecord = () => {
    let fields = R.clone(appState.config.fields);
    let rec = {};
    R.map((o) => {
      rec = R.set(R.lensProp(o.name), '', rec);
    }, fields);
    return rec;
  };

  const append = (prop, el) => {
    appState[prop] = R.append(el, appState[prop]);
    dispatchChanged();
  };

  const setFieldState = (name, value) => {
    const index = appState.config.fields.findIndex(item => item.name === name);
    appState = R.set(R.lensPath(['config', 'fields', index ,'state']), value, appState);

  };

  const dispatchChanged = () => {
    on.changed.dispatch({
      model: appState
    });
  };

  const destroy = () => {

  };

  return {
    initialize: initialize,
    destroy: destroy,
    on: on,
    get: get,
    set: set,
    append: append,
    getVoidRecord: getVoidRecord,
    setRecord: setRecord,
    setFieldState: setFieldState
  };
};

export default Model;
