import signals from 'signals';
import R from 'ramda';


const LayoutModel = (data) => {

  let appState = {
    status: "initial",
    records: []
  };

  const usersLens = R.lensProp('records');

  const setRecords = (records) => {
    appState = R.set(usersLens, records, appState);

    console.log(appState);
    dispatchChanged();
  };

  const getAppState = () => {
    return appState;
  };

  const initialize = function(opts) {
    //setState(opts);
    //dispatchChanged();
  };

  const on = {
    changed: new signals.Signal()
  };

  const dispatchChanged = () => {
    on.changed.dispatch({
      model: getAppState(),
    });
  };

  const getRecords = () => {
    return appState.records;
  };

  const setState = (state) => {
    appState = Object.assign({}, state);
  };

  const getStatus = () => {
    return appState.status;
  };

  const setStatus = (state) => {
    appState.status = state;
  };

  const destroy = () => {

  };

  return {
    initialize: initialize,
    destroy: destroy,
    setStatus: setStatus,
    getStatus: getStatus,
    getAppState: getAppState,
    on: on,
    setRecords: setRecords,
    getRecords: getRecords
  };
};

export default LayoutModel;
