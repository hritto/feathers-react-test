import React from 'react';
import { render } from 'react-dom';
import Model from '../common/model.js';
import NavigationController from './controller.js';
import NavigationLayout from '../../components/commons/Navigation.jsx';

if (module.hot) {
  module.hot.accept();
}

const Navigation = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    config: [{
      title: "Usuarios",
      icon: "users",
      route: "users",
      permission: "users",
      modules: ["Users"], //module/s
      dom: ["main_content"],
      config: [{}], //Estra options
      instanceIds: ["users"]
    },
    {
      title: "Actividades",
      icon: "game",
      route: "activities",
      permission: "activity",
      modules: ["Activities"],
      dom: ["main_content"],
      config: [{}],
      instanceIds: ["activities"]
    }],
    focus_index: 0, //Por defecto, el primer item del menu
    current_item: null
  };

  let options = null;
  let _model = Model(appState);
  let _controller = NavigationController();
  const _sb = sb;

  const initialize = (opts, done) => {
    options = opts;
    _model.on.changed.add(onRender);
    _model.initialize();
    _controller.initialize({
      sb: _sb
    }, _model);
    _sb.emit("layout.navigation.menuClick", {index: 0, module:appState.config[0], current: null});
    done();
  };

  const onRender = (props) => {
    props.controller = _controller;
    render( <NavigationLayout {...props} />,
      document.getElementById(options.el)
    );
  };

  const destroy = (done) => {

  };

  return {
    init: initialize,
    destroy: destroy
  };
};

module.exports = {
  module: Navigation
};
