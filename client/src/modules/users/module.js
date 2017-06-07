import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import UsersController from './controller.js';
import UsersView from '../../components/users/view.jsx';

if (module.hot) {
  module.hot.accept();
}

const Users = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    records: [],
    selected_record_id: null,
    title: "Usuarios",
    icon: "users",
    route: "users",
    permission: "users",
    state: "initial", //initial, update, create, delete
    buttons: ['update', 'create', 'delete'],
    form_config: {
      _id: {
        type: 'hidden'
      },
      role: {
        type: 'combo'
      },
      email: {
        type: 'text'
      },
      password: {
        type: 'password'
      }
    }
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
    ReactDOM.render( <UsersView {...props} />,
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
