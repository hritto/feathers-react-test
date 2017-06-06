import React from 'react';
import ReactDOM from 'react-dom';
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
    ReactDOM.render( <UserList {...props} />,
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
  module: Users
};
