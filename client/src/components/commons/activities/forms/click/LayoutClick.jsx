import React, { Component } from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu } from 'semantic-ui-react';
import LayoutHelpers from '../../../positioning_helper.js';
import common_config from '../../layout_click/common_config.js'
import css from '../../../../../../assets/css/app.css';
import R from 'ramda';
import LayoutClickPreview from '../../layout_click/app.js';
const Promise = require("bluebird");

class LayoutClickForm extends Component {
  constructor(props) {
    super(props);
    this.state = R.merge(props.state, {
      layout_active_index: props.state.active_index
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this._updateModel = this._updateModel.bind(this);
    this._calculateLayout = this._calculateLayout.bind(this);
    this.formView = this.formView.bind(this);
    this.app = null;
  }

  _updateModel() {
    this.props.controller.updateActivityCode({
      code: this.state.code,
      media: this.state.media
    });
  };

  handleChange(lens, value) {
    this.setState((state) => {
      return R.set(R.lensPath(lens), value, state);
    }, function () {
      this._updateModel();
    });
  }

  _calculateLayout() {

    return new Promise(function (resolve, reject) {
      //LayoutHelpers
    }).then(function () {
      return resolve();
    });
  }

  handleSubmit(event) {
    this._updateModel();
    event.preventDefault();
  }

  handleCancel(event) {
    this.props.controller.handleCancel(this.state);
    event.preventDefault();
  }

  componentDidMount() {
    //Renderizar solo la escena abierta
    // Lanzar el módulo de render
    const config = {
      code: this.state.code,
      media: this.state.media
    };
    let self = this;
    if (!this.app) {
      return Promise.delay(500).then(function(){
        self.app = new LayoutClickPreview(config, common_config, self.state.layout_active_index);
        self.app.init();
      });
    }
  }

  formView(target) {
    //////////////////////////////
    // GUARDAR LOS DATOS
    /////////////////////////////
    const self = this;
    let layout_data = null;
    this.app.destroy().then(function (el_layout) {
      // GUARDAR LOS DATOS
      self.updateModelLayout(el_layout);
      // VOLVER AL FORM
      self.props.props.controller.tabClick('form');
    });
  };

  updateModelLayout(layout_data) {
    const self = this;
    const index = this.props.state.active_index;

    _.each(layout_data, function (element, key) {
      if (element.size) {
        self.props.change(['code', index, 'elements', key, 'size'], element.size);
      }
      if (element.pos) {
        self.props.change(['code', index, 'elements', key, 'pos'], element.pos);
      }
    });
  }

  _setLayoutActiveIndex(e, i) {
    let val = i;
    if (this.state.active_index === i) {
      val = null;
    }
    this.setState((state) => {
      return R.set(R.lensProp('layout_active_index'), val, state);
    });
    window.dispatchEvent(new Event('resize'));
  };

  render() {
    return <Segment id='main_layout'>
      <Button type="button" floated='right' color='blue' key={'button_back'} content='Volver' icon='arrow circle left' size='mini' labelPosition='right' onClick={this.formView.bind(this, { target: 'form' })} />
      <div id="loader_div" className="loader_div">
        <div>
          <input type="text" defaultValue="0" className="dial" data-angleOffset="90" data-linecap="round" />
        </div>
      </div>
      <div id="main">
        <div className="btns">
          <div id="btn_home" className="uihome"></div>
          <div id="btn_back" className="uiback"></div>
          <div id="btn_next" className="uinext"></div>
          <div id="btn_redo" className="uiredo"></div>
        </div>
        <div id="menu">
          <div className="slider">
            <div id="main_menu" className="rita_menu">
              <div id="arrow" className="right"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="container"></div>
    </Segment>
  }
};


export default LayoutClickForm
