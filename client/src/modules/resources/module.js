import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import ResourcesController from './controller.js';
import ResourcesView from '../../components/resources/view.jsx';
import R from 'ramda'

if (module.hot) {
  module.hot.accept();
}

const Resources = function (sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    title: "Recursos",
    icon: "cloud upload",
    route: "resources",
    permission: "resources",
    state: "initial", //initial, update, create, delete
    buttons: ['update', 'create', 'delete'],
    records: [],
    selected_record: null,
    loading: false, // form, layout, preview
    message: null,
    config: {
      combo_constructors: [{
        resource_type: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'resource_type',
              data: [{
                key: '0',
                value: 0,
                text: 'Actividad interactiva'
              }, {
                key: '1',
                value: 1,
                text: 'Audio'
              }, {
                key: '2',
                value: 2,
                text: 'Vídeo: YouTube'
              }, {
                key: '3',
                value: 3,
                text: 'Vídeo: Vimeo'
              }, {
                key: '4',
                value: 4,
                text: 'Presentación HTML'
              }, {
                key: '5',
                value: 5,
                text: 'Galería de imágenes'
              }]
            });
          });
        }
      }, {
        level: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'level',
              data: [{
                  key: '0',
                  value: 0,
                  text: 'Nivel Inicial'
                },
                {
                  key: '1',
                  value: 1,
                  text: 'Nivel Básico'
                },
                {
                  key: '2',
                  value: 2,
                  text: 'Nivel Medio'
                },
                {
                  key: '3',
                  value: 3,
                  text: 'Nivel Alto'
                },
              ]
            });
          });
        }
      }, {
        competence: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'competence',
              data: [{
                key: '0',
                value: 0,
                text: 'Competencia 1'
              }, {
                key: '1',
                value: 1,
                text: 'Competencia 2'
              }, {
                key: '2',
                value: 2,
                text: 'Competencia 3'
              }, {
                key: '3',
                value: 3,
                text: 'Competencia 4'
              }]
            });
          });
        }
      }, {
        cognitive_process: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'cognitive_process',
              data: [{
                key: '0',
                value: 0,
                text: 'Proceso 1'
              }, {
                key: '1',
                value: 1,
                text: 'Proceso 2'
              }, {
                key: '2',
                value: 2,
                text: 'Proceso 3'
              }, {
                key: '3',
                value: 3,
                text: 'Proceso 4'
              }]
            });
          });
        }
      }, {
        capacity: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'capacity',
              data: [{
                key: '0',
                value: 0,
                text: 'Capacidad 1'
              }, {
                key: '1',
                value: 1,
                text: 'Capacidad 2'
              }, {
                key: '2',
                value: 2,
                text: 'Capacidad 3'
              }, {
                key: '3',
                value: 3,
                text: 'Capacidad 4'
              }]
            });
          });
        }
      }],
      combo_values: {},
      state: 'initial',
      form_columns: 2,
      filter: true,
      fields: [{
          name: '_id',
          type: 'hidden',
          visibility: false,
          flex: 0,
          filter: false,
          message: '',
          validation: {},
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'ID',
          state: 'initial'
        },
        {
          name: 'name',
          type: 'text',
          visibility: true,
          flex: 40,
          filter: true,
          validation: {
            required: true
          },
          message: 'Por favor, ingrese un valor.',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Nombre',
          state: 'initial'
        },
        {
          name: 'description',
          type: 'textarea',
          visibility: false,
          flex: 0,
          filter: true,
          validation: {
            required: false
          },
          message: null,
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Descripción',
          state: 'initial'
        },
        {
          name: 'resource_type',
          type: 'combo',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: 'resource_type',
          wrapped: false,
          form_visible: true,
          label: 'Tipo de recurso',
          state: 'initial',
          renderer: function (value, opts) {
            const selected = R.find(R.propEq('value', parseInt(value)), opts);
            if (selected) {
              return R.prop('text', selected);
            }
            return '';
          }
        },
        {
          name: 'level',
          type: 'combo',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: 'level',
          wrapped: false,
          form_visible: true,
          label: 'Nivel',
          state: 'initial',
          renderer: function (value, opts) {
            const selected = R.find(R.propEq('value', parseInt(value)), opts);
            if (selected) {
              return R.prop('text', selected);
            }
            return '';
          }
        },
        {
          name: 'published',
          type: 'boolean',
          visibility: true,
          flex: 5,
          filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Publicado',
          state: 'initial',
        },
        {
          name: 'url',
          type: 'hidden',
          visibility: false,
          flex: 0,
          filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: false,
          label: 'url',
          state: 'initial',
        }, {
          name: 'competence',
          type: 'combo',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: 'competence',
          wrapped: false,
          form_visible: true,
          label: 'Competencia',
          state: 'initial',
          renderer: function (value, opts) {
            const selected = R.find(R.propEq('value', parseInt(value)), opts);
            if (selected) {
              return R.prop('text', selected);
            }
            return '';
          }
        }, {
          name: 'cognitive_process',
          type: 'combo',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: 'cognitive_process',
          wrapped: false,
          form_visible: true,
          label: 'Proceso cognitivo',
          state: 'initial',
          renderer: function (value, opts) {
            const selected = R.find(R.propEq('value', parseInt(value)), opts);
            if (selected) {
              return R.prop('text', selected);
            }
            return '';
          }
        }, {
          name: 'capacity',
          type: 'combo',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: 'capacity',
          wrapped: false,
          form_visible: true,
          label: 'Capacidad',
          state: 'initial',
          renderer: function (value, opts) {
            const selected = R.find(R.propEq('value', parseInt(value)), opts);
            if (selected) {
              return R.prop('text', selected);
            }
            return '';
          }
        }, {
          name: 'original_name',
          type: 'text',
          visibility: true,
          flex: 10,
          filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Nombre original',
          state: 'initial',
          renderer: null
        }, {
          name: 'folder_name',
          type: 'hidden',
          visibility: false,
          flex: 0,
          filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Original_folder',
          state: 'initial',
          renderer: null
        }
      ],
    }
  };

  let options = null;
  let _model = Model(appState);
  let _controller = ResourcesController();
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
    ReactDOM.render( < ResourcesView { ...props
      }
      />,
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
  module: Resources
};
