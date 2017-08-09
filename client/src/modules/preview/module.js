import React from 'react';
import ReactDOM from 'react-dom';
import Model from '../common/model.js';
import PreviewController from './controller.js';
import PreviewModal from '../../components/activities/PreviewModal.jsx';
import R from 'ramda'

if (module.hot) {
  module.hot.accept();
}

const Preview = function (sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    title: "Preview",
    icon: "game",
    route: "preview",
    permission: "preview",
    state: "initial", //initial, update, create, delete
    buttons: [],
    activity_code: null,
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
    if(props.model.activity_code){
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
