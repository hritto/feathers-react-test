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
    avatars: [],
    selected_record: null,
    config: {
      combo_constructors: [{
        gender: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'gender',
              data: [
                { key: 'male', value: 'male', text: 'Masculino' },
                { key: 'female', value: 'female', text: 'Femenino' }
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
                { key: 'admin', value: 'admin', text: 'Administrador' },
                { key: 'editor', value: 'editor', text: 'Editor' },
                { key: 'profesor', value: 'profesor', text: 'Profesor' },
                { key: 'user', value: 'user', text: 'Usuario' },
                { key: 'student', value: 'student', text: 'Alumno' }
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
          message: '',
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'ID',
          state: 'initial'
        },
        {
          name: 'name',        type: 'text',
          visibility: true,  flex: 40, filter: true,
          validation: {required: true},
          message: 'Por favor, ingrese un valor.',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Nombre',
          state: 'initial'
        },
        {
          name: 'surname',        type: 'text',
          visibility: false,  flex: 0, filter: true,
          validation: {required: true},
          message: 'Por favor, ingrese un valor.',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Apellidos',
          state: 'initial'
        },
        {
          name: 'email', type: 'text',
          visibility: true,  flex: 30, filter: true,
          validation: {required: true, email: true},
          message: 'Por favor, ingrese un valor válido.',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Correo electrónico',
          state: 'initial'
        },
        {
          name: 'gender',        type: 'combo',
          visibility: true,  flex: 10, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Género',
          state: 'initial',
        },
        {
          name: 'role',        type: 'combo',
          visibility: true,  flex: 5, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Rol',
          state: 'initial',
          renderer: function(value){
            switch (value) {
              case 'admin':
                  return 'Administrador'
              case 'editor':
                  return 'Editor'
              case 'user':
                  return 'Usuario'
              case 'profesor':
                  return 'Profesor'
              default:
                  return 'Alumno';
            }
          }
        },
        {
          name: 'active',        type: 'boolean',
          visibility: true,  flex: 5, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Activo',
          state: 'initial',
          
        },
        {
          name: 'password',        type: 'password',
          visibility: false,  flex: 0, filter: false,
          validation: {required: true},
          message: 'Por favor, ingrese un valor.',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'contraseña',
          state: 'initial'
        },
        {
          name: 'photo', type: 'image',
          visibility: false,  flex: 0, filter: false,
          tooltip: '', validation: {}, message: '',
          messages: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Foto',
          state: 'initial'
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
