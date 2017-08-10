import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import LoginController from './controller.js';
import LoginView2 from '../../components/commons/LoginViewSemantic.jsx';

if (module.hot) {
  module.hot.accept();
}

const Login = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    status: "initial",
    visible: true,
    animation: "push",
    current_user: null
  };

  let options = null;
  let _model = Model(appState);
  let _controller = LoginController();
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
    ReactDOM.render( <LoginViewSemantic {...props} />,
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
  module: Login
};
