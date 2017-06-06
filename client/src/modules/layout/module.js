import React from 'react';
import { render } from 'react-dom';
import Model from '../common/model.js';
import LayoutController from './controller.js';
import MainLayout from '../../components/commons/MainLayout.jsx';

if (module.hot) {
  module.hot.accept();
}

const Layout = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    status: "initial",
    layout: "wide", //small < 768
    visible: true,
    animation: "push"
  };

  let options = null;
  let _model = Model(appState);
  let _controller = LayoutController();
  const _sb = sb;

  const initialize = opts => {
    options = opts;
    _model.on.changed.add(onRender);
    _controller.initialize({
      sb: _sb
    }, _model);
    _model.initialize();
  };

  const onRender = (props) => {
    props.controller = _controller;
    render( <MainLayout {...props} />,
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
  module: Layout
};
