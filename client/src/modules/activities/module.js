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
    title: "Actividades",
    icon: "game",
    route: "activities",
    permission: "activity",state: "initial", //initial, update, create, delete
    buttons: ['update', 'create', 'delete'],
    records: [],
    avatars: [],
    selected_record: null,
    config: {
      combo_constructors: [{
        activity_type: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'activity_type',
              data: [
                { key: 'click', value: 'click', text: 'Hacer click' },
                { key: 'drag', value: 'drag', text: 'Arrastrar y soltar' },
                { key: 'memory', value: 'memory', text: 'Memoria' },
                { key: 'paint', value: 'paint', text: 'Dibujo libre' },
                { key: 'intro', value: 'intro', text: 'Escena introductoria' }
              ]
            });
          });
        }
      },{
        level: function () {
          return new Promise(function (resolve, reject) {
            resolve({
              name: 'level',
              data: [
                { key: '0', value: 0, text: 'Nivel Inicial' },
                { key: '1', value: 1, text: 'Nivel Básico' },
                { key: '2', value: 2, text: 'Nivel Medio' },
                { key: '3', value: 3, text: 'Nivel Alto' },
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
          name: 'activity_type',        type: 'combo',
          visibility: true,  flex: 10, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Tipo de actividad',
          state: 'initial',
        },
        {
          name: 'level',        type: 'combo',
          visibility: true,  flex: 10, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Nivel',
          state: 'initial',
        },
        {
          name: 'published',        type: 'boolean',
          visibility: true,  flex: 5, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Publicada',
          state: 'initial',
          
        },{
          name: 'code',        type: 'json',
          visibility: false,  flex: 0, filter: false,
          validation: {},
          message: '',
          constructor: null,
          wrapped: false,
          form_visible: true,
          label: 'Código',
          state: 'initial',
        }],
    }
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
