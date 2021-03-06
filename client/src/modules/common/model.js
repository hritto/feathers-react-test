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
    getVoidRecord: getVoidRecord,
    setRecord: setRecord
  };
};

export default Model;
