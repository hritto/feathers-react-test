import React from 'react';
import { Icon, Button, Card, Image, Popup, Form } from 'semantic-ui-react';
import Helpers from '../click/helpers.js';
import R from 'ramda';
import MediaComponent from './MediaComponent.jsx';
import CheckboxResolution from './CheckboxResolution.jsx';
import DropDownQuestionModelImage from './DropDownQuestionModelImage.jsx';

let mProps = null;

//Borrar elemento (respuesta o modelo)
const deleteElementClick = (opts) => {
  mProps.handleDeleteElement(opts.element, opts.index);
};

const getMediaImageUrl = (img) => {
  return mProps.state.media.images[img];
};

const getLayoutImageUrl = (lens, state) => {
  const layout = R.view(R.lensPath(lens), state);
  if(!layout || layout === 'landscape'){
    return '/assets/images/activities/layout_up.png';
  }
  if(layout === 'portrait'){
    return '/assets/images/activities/layout_i.png';
  }
  return '/assets/images/activities/layout_none.png';
};

const getLayoutImagePosUrl = (lens, state, main_layout) => {
  const layout = R.view(R.lensPath(lens), state);
  if(!main_layout || main_layout === 'landscape'){
    if(!layout || layout === 'up'){
      return '/assets/images/activities/layout_up.png';
    }
    return '/assets/images/activities/layout_down.png';
  }
  if(main_layout === 'portrait'){
    if(layout !== 'right'){
      return '/assets/images/activities/layout_i.png';
    }
    return '/assets/images/activities/layout_d.png';
  }
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

const getDropdownLayoutPositionOptions = (layout_type) => {
  if (!layout_type || layout_type === 'landscape') {
    return [
      { key: 'up', value: 'up', text: 'Arriba', image:'/assets/images/activities/layout_up.png' },
      { key: 'down', value: 'down', text: 'Abajo', image:'/assets/images/activities/layout_down.png' }
    ];
  }
  return [
    { key: 'left', value: 'left', text: 'Izquierda', image:'/assets/images/activities/layout_i.png' },
    { key: 'right', value: 'right', text: 'Derecha', image:'/assets/images/activities/layout_d.png' }
  ];
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
  let dropdown_model_layout_type = '';
  let dropdown_model_layout_position = '';

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
    dropdown_model_layout_type = (
      <DropDownQuestionModelImage {...props}
        name={'layout_type' + _.uniqueId()}
        title='Tipo de layout'
        child_field = {['code', scene_index, 'elements', el_key, 'layout_position']}
        image={getLayoutImageUrl(['code', scene_index, 'elements', el_key, 'layout_type'], props.state)}
        field={['code', scene_index, 'elements', el_key, 'layout_type']}
        options={[
          { key: 'horizontal', value: 'landscape', text: 'Horizontal', image:'/assets/images/activities/layout_up.png' },
          { key: 'vertical', value: 'portrait', text: 'Vertical', image:'/assets/images/activities/layout_i.png' },
          { key: 'libre', value: 'other', text: 'Libre', image:'/assets/images/activities/layout_none.png' }
      ]} />);
    if (el.layout_type !== 'other'){
      dropdown_model_layout_position = (
        <DropDownQuestionModelImage {...props}
        name={'layout_position' + _.uniqueId()}
        title='Posición del modelo'
        image={getLayoutImagePosUrl(['code', scene_index, 'elements', el_key, 'layout_position'], props.state, el.layout_type)}
        field={['code', scene_index, 'elements', el_key, 'layout_position']}
        options={getDropdownLayoutPositionOptions(el.layout_type)} />);
    }

  } else {
    //Tipos de actividades
    if (props.activity_type === 0) { // Estática
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
        {dropdown_model_layout_type}
        {dropdown_model_layout_position}
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
