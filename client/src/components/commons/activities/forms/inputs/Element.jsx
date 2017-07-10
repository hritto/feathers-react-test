import React from 'react';
import { Icon, Button, Card, Image, Popup } from 'semantic-ui-react';
import Helpers from '../click/helpers.js';
import R from 'ramda';
import MediaComponent from './MediaComponent.jsx';
import CheckboxResolution from './CheckboxResolution.jsx';

let mProps = null;

//Borrar elemento (respuesta o modelo)
const deleteElementClick = (opts) => {
  mProps.handleDeleteElement(opts.element, opts.index);
};

const getMediaImageUrl = (img) => {
  return mProps.state.media.images[img];
};

const _getSoundName = (name) => {
  let str = '';
  if (name.length > 30) {
    str = name.substring(0, 20) + "..." + name.substring(name.length - 4);
    return str;
  }
  return name;
};

const _getElementText = (text) => {
  if (text.length > 30) {
    return text.substring(0, 30) + "...";
  }
  return text;
};


const Element = (props) => { // el, el_key, scene_index
  mProps = props;
  let image = '';
  let sound = '';
  let text = '';
  let check = '';
  let fluid = false;
  let scene_index = props.index;
  let el = props.element;
  let el_key = props.field;
  let meta = '';
  let el_type = '';

  if (el.image) {
    image = <div className='element_media'><Icon name='image' />: <Image key={'image' + el.image} size='mini' src={Helpers.uploadedImage(getMediaImageUrl(el.image))} /></div>
    el_type = 'imagen';
  }
  if (el.sound) {
    sound = <div className='element_media'><Icon name='music' />: {_getSoundName(el.sound)}</div>
    el_type = 'audio';
  }
  if (el.text) {
    text = <div className='element_media'><Icon name='file text outline' />: {_getElementText(el.text)}</div>
    el_type = 'text';
  }
  if (el.type === 'question_model') {
    fluid = true;
    meta = <Card.Meta key={el.type + _.uniqueId()} >Tipo: Pregunta/Modelo</Card.Meta>;
  } else {
    //Tipos de actividades
    if (props.activity_type === 0) { // Click
      meta = <Card.Meta>{'Tipo: ' + el_type}</Card.Meta>;
    }
    if (props.activity_type === 1) { // Click
      check = <CheckboxResolution {...props} name={el_key} title='Correcta' />
      meta = <Card.Meta>Tipo: Respuesta - Clickable</Card.Meta>;
    }
    if (props.activity_type === 2) { // DragNdrop
      meta = <Card.Meta>Tipo: Respuesta - Arrastrable</Card.Meta>;
    }
  }


  return (<Card key={'element_' + el.id} fluid={fluid}>
    <Card.Content key={'content_' + _.uniqueId()}>
      <Popup
        trigger={<Button circular icon='remove circle' floated='right' onClick={deleteElementClick.bind(this, { element: el.id, index: props.index })} />}
        content='Borrar elemento.'
        on='hover'
      />
      <Card.Header key={'header_' + _.uniqueId()}>
        {el.id}
      </Card.Header>
      {meta}
      <Card.Description>
        {image}
        {sound}
        {text}
        {check}
      </Card.Description>
    </Card.Content>
    <Card.Content extra key={'extra_content_' + _.uniqueId()}>
      <MediaComponent {...props}
        name={'elements' + el_key}
        title='Añadir medios'
        field={['code', scene_index, 'elements', el_key]}
        options={{
          image: el.image,
          sound: el.sound,
          text: el.text,
          enabled: {
            image: true,
            sound: true,
            text: false,
          }
        }} />
    </Card.Content>
  </Card>)
};

export default Element;