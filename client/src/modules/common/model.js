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

  const get = (prop) => R.prop(prop, appState);

  const set = (prop, value, dispatch) => {
    appState = R.set(R.lensProp(prop), value, appState);
    if(dispatch){
      dispatchChanged();
    }
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
    set: set
  };
};

export default Model;
