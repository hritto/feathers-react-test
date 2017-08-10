const Promise = require("bluebird");
import React, { Component } from 'react';
import { Container, Header, Icon, Menu, Segment, Embed } from 'semantic-ui-react';
import R from 'ramda';

class PreviewResourceView extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.model.selected_record;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    /* Acceso al iframe, en caso de no usar SemanticUI Embed
    return Promise.delay(500).then(function () {
      self.ifr.onload = () => {
        //self.ifr.contentWindow.postMessage('hello', "*");
      }
    });*/
  }

  getElementPreview() {
    const tipo = parseInt(this.state.resource_type, 10);
    if (tipo === 0 || tipo === 1 || tipo === 4 || tipo === 5) {
      return <Embed
        icon='right circle arrow'
        placeholder='./assets/images/placeholder.png'
        url={"./resources/" + this.state.url} />
    }
    if (tipo === 2) { //YouTube
      return <Embed
        autoplay={true}
        brandedUI={false}
        color='white'
        hd={false}
        icon='right circle arrow'
        id={this.state.url}
        source='youtube' />
    }
    if (tipo === 3) { //Vimeo
      return <Embed
        autoplay={true}
        brandedUI={false}
        color='white'
        hd={false}
        icon='right circle arrow'
        id={this.state.url}
        source='vimeo' />
    }
    return '';
  }

  render(){
    return this.getElementPreview();
  }

  /* sandbox="allow-scripts"
  Pintar el iframe, en caso de no usar SemanticUI Embed
  render() {
    return <Segment id='main_layout'>
      <iframe src={"./resources/" + this.state.url} width='100%' height='100%' ref={(f) => this.ifr = f} />
    </Segment>
  }
  */
};

export default PreviewResourceView;
