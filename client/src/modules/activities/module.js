import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import Model from '../common/model.js';
import ActivitiesController from './controller.js';
import Table from '../../components/commons/grid_manager/Table.jsx';

if (module.hot) {
  module.hot.accept();
}

const Activities = function(sb) {
  'use strict';

  //Estado ---> Model
  let appState = {
    records: []
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
    render( <Table {...props} />,
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
