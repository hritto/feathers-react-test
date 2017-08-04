import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import PreviewController from './controller.js';
import PreviewModal from '../../components/resources/PreviewModal.jsx';
import R from 'ramda'

if (module.hot) {
  module.hot.accept();
}

const Preview = function (sb) {
  'use strict';
  //Estado ---> Model
  let appState = {
    title: "Preview_resource",
    icon: "cloud upload",
    route: "preview_resource",
    permission: "preview_resource",
    state: "initial", //initial, update, create, delete
    buttons: [],
    selected_record: null,
    message: null,
    config: {}
  };

  let options = null;
  let _model = Model(appState);
  let _controller = PreviewController();
  const _sb = sb;

  const initialize = (opts, done) => {
    options = opts;
    _model.on.changed.add(onRender);
    _model.initialize();
    _controller.initialize({
      sb: _sb,
      options: options
    }, _model);
    done();
  };

  const onRender = (props) => {
    if(props.model.selected_record){
      props.controller = _controller;
      ReactDOM.render( <PreviewModal { ...props } />,
        document.getElementById(options.module.dom[0])
      );
    }
  };

  const destroy = (done) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(options.module.dom[0]));
    done();
  };

  return {
    init: initialize,
    destroy: destroy
  };
};

module.exports = {
  module: Preview
};
