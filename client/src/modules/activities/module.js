import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import ActivitiesController from './controller.js';
import ActivitiesView from '../../components/activities/view.jsx';

if (module.hot) {
  module.hot.accept();
}

const Activities = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    records: [],
    title: "Actividades",
    icon: "game",
    route: "activities",
    permission: "activity",
  };

  let options = null;
  let _model = Model(appState);
  let _controller = ActivitiesController();
  const _sb = sb;

  const initialize = (opts, done) => {
    options = opts;
    _model.on.changed.add(onRender);
    _model.initialize();
    _controller.initialize({
      sb: _sb
    }, _model);
    done();
  };

  const onRender = (props) => {
    props.controller = _controller;
    ReactDOM.render( <ActivitiesView {...props} />,
      document.getElementById(options.el)
    );
  };

  const destroy = (done) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(options.el));
    done();
  };

  return {
    init: initialize,
    destroy: destroy
  };
};

module.exports = {
  module: Activities
};
