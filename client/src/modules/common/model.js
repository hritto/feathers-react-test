import signals from 'signals';
import R from 'ramda';

const Model = (data) => {

  let appState = R.clone(data);

  const initialize = function() {
    dispatchChanged();
  };

  const getter = (prop) => R.prop(prop, appState);

  const setter = (prop, value, dispatch) => {
    appState = R.set(R.lensProp(prop), value, appState);
    if(dispatch){
      dispatchChanged();
    }
  };

  const on = {
    changed: new signals.Signal()
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
    getter: getter,
    setter: setter
  };
};

export default Model;
