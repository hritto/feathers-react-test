const Promise = require("bluebird");
import React, { Component } from 'react';
import { Container, Header, Icon, Menu, Segment, Button, Modal } from 'semantic-ui-react';
import R from 'ramda';


class PreviewView extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.model.selected_record;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const config = {
      code: this.state.code,
      media: this.state.media
    };
    let self = this;
    if (!this.app) {
      return Promise.delay(500).then(function () {
        self.ifr.onload = () => {
          //self.ifr.contentWindow.postMessage('hello', "*");
        }
      });
    }
  }

  //sandbox="allow-scripts" ?

  render() {
    return <Segment id='main_layout'>
      <iframe src={"./resources/" + this.state.url} width='100%' height='100%' ref={(f) => this.ifr = f} />
    </Segment>
  }
};

export default PreviewView;
