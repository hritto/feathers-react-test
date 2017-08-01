const Promise = require("bluebird");
import React, { Component } from 'react';
import { Container, Header, Icon, Menu, Segment, Button, Modal } from 'semantic-ui-react';
import css from '../../../assets/css/app.css';
import R from 'ramda';
import Player from '../commons/activities/player/app.js';
import common_config from '../commons/activities/player/common_config.js'


class PreviewView extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.model.activity_code;
  }

  componentDidMount() {
    const config = {
      code: this.state.code,
      media: this.state.media
    };
    let self = this;
    if (!this.app) {
      return Promise.delay(500).then(function(){
        self.app = new Player(config, common_config);
        self.app.init();
      });
    }
  }

  render() {
    return <Segment id='main_layout'>
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
        <div id="infoWindow" role="infoWin">
          <div id='bubble'></div>
        </div>
        <div id="screenBlocker"></div>
      </div>
      <div id="initWindow" role="initWin">
        <div id='init_content'></div>
      </div>
      <div id="container"></div>
      <div id="signal_ok"></div>
      <div id="signal_ko"></div>
    </Segment>
  }
};

export default PreviewView;
