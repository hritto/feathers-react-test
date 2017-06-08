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
    title: "Usuarios",
    icon: "users",
    route: "users",
    permission: "users",
    state: "initial", //initial, update, create, delete
    buttons: ['update', 'create', 'delete'],
    records: [],
    selected_record: null,
    config: {
      combo_constructors: [{
        gender: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'gender',
              data: [
                { id: 'male', name: 'masculino' },
                { id: 'female', name: 'femenino' }
              ]
            });
          });
        }
      },
      {
        role: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'role',
              data: [
                { id: 'admin', name: 'Admin' },
                { id: 'user', name: 'User' }
              ]
            });
          });
        }
      }],
      combo_values: {},
      state: 'initial',
      form_columns: 2,
      filter: true,
      fields: [
        {
          name: '_id',          type: 'hidden',
          visibility: false, flex: 0, filter: false,
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'ID'
        },
        {
          name: 'name',        type: 'text',
          visibility: true,  flex: 33, filter: true,
          validation: {required: true},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Nombre'
        },
        {
          name: 'surname',        type: 'text',
          visibility: true,  flex: 33, filter: true,
          validation: {required: true},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Apellidos'
        },
        {
          name: 'email', type: 'text',
          visibility: true,  flex: 33, filter: true,
          validation: {required: true, email: true, maxlength: 250},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Correo electrónico'
        },
        {
          name: 'gender',        type: 'combo',
          visibility: false,  flex: 0, filter: false,
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Género'
        },
        {
          name: 'role',        type: 'combo',
          visibility: false,  flex: 0, filter: false,
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Rol'
        },
        {
          name: 'active',        type: 'boolean',
          visibility: false,  flex: 0, filter: false,
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Activo'
        },
        {
          name: 'password',        type: 'password',
          visibility: false,  flex: 0, filter: false,
          validation: {required: true},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'contraseña'
        },
        {
          name: 'password_confirmation',        type: 'password',
          visibility: false,  flex: 0, filter: false,
          validation: { required: true, equalTo: "password" },
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Confirmar contraseña'
        },{
          name: 'photo', type: 'image',
          visibility: false,  flex: 0, filter: false,
          tooltip: '', validation: {},
          messages: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Foto'
        }],
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
