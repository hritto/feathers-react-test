import React from 'react';
import { render } from 'react-dom';
import Model from '../common/model.js';
import UsersController from './controller.js';
import UserList from '../../components/commons/UserList.js';

if (module.hot) {
  module.hot.accept();
}

const Users = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    records: []
  };

  let options = null;
  let _model = Model(appState);
  let _controller = UsersController();
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
    render( <UserList {...props} />,
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
  module: Users
};
