import signals from 'signals';
import R from 'ramda';

const LayoutModel = (data) => {

  let appState = {
    status: "initial",
    layout: "wide", //small < 1024
    visible: true,
    records: []
  };

  //Lenses
  const visibleLens = R.lensProp('visible');
  const layoutLens = R.lensProp('layout');
  const statusLens = R.lensProp('status');

  const initialize = function(opts) {
    //setState(opts);
    //dispatchChanged();
  };

  const getVisibility = () => {
    return appState.visible;
  };

  const setVisibility = (visible) => {
    appState = R.set(visibleLens, visible, appState);
    dispatchChanged();
  };

  const setLayout = (layout) => {
    appState = R.set(layoutLens, layout, appState);
    dispatchChanged();
  };

  const getStatus = () => {
    return appState.status;
  };

  const setStatus = (status) => {
    appState = R.set(statusLens, status, appState);
    dispatchChanged();
  };

  const on = {
    changed: new signals.Signal()
  };

  const dispatchChanged = () => {
    on.changed.dispatch({
      model: getAppState(),
    });
  };






  const usersLens = R.lensProp('records');
  const setRecords = (records) => {
    appState = R.set(usersLens, records, appState);
    dispatchChanged();
  };
  const getAppState = () => {
    return appState;
  };
  const getRecords = () => {
    return appState.records;
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
    getRecords: getRecords,
    setVisibility: setVisibility,
    getVisibility: getVisibility,
    setLayout: setLayout
  };
};

export default LayoutModel;
