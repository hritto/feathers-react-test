
import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu, Label, Divider, Card, Image, Popup } from 'semantic-ui-react';
import SimpleInputText from '../inputs/TextSimple.jsx';
import SimpleInputPassword from '../inputs/PasswordSimple.jsx';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import CheckboxSimple from '../inputs/CheckboxSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import ColorPicker from '../inputs/ColorPicker.jsx';
import LabeledInputText from '../inputs/TextSimpleLabeled.jsx';
import CheckboxLabeled from '../inputs/CheckboxLabeled.jsx';
import Helpers from './helpers.js';
import MediaComponent from '../inputs/MediaComponent.jsx';
import R from 'ramda';

let p = [];
let main_props = null;
let index = null;
let element_default = {
  "id": null,
  "pos": {
    "x": 0,
    "y": 0
  },
  "size": {
    "w": 100,
    "h": 100
  },
  "image": null,
  "sound": null,
  "text": null,
  "type": "clickable"
}

const FormPanel = (props) => {
  p = [];
  main_props = props;
  index = parseInt(props.index, 10);

  //Renderizar solo la escena abierta
  if (parseInt(props.state.active_index, 10) === index) {
    return {
      title: 'Escena ' + index,
      content: formClickTemplate(props),
    }
  }
  return {
    title: 'Escena ' + index,
    content: '',
  }
};

const formClickTemplate = (props) => {
  /*
  "instruction": {
    "text": "Hacemos algo en equipo. Empiezan con A.",
    "sound": "titulo0"
  }
  TIPOS DE ACTIVIDAD:
  0: ESTÁTICA CON O SIN timer
  1: Click
  2: DRAG AN Drop
  3: MEMORY
  4: DIBUJO LIBRE
  //ELEMENTS //Depende del type

  MANEJAR EL LAYOUT DE ELEMENTOS DE ACTIVIDADES...!!!!!!!!

  TODO: MANEJAR LOS ELEMENTOS DEPENDIENDO DEL TIPO DE ACTIVIDAD
  TODO: MADIACOMPONENT PARA LA IMAGEN DE FONDO DE LA ACTIVIDAD
  TODO: MANEJAR LA CONFIGURACION DE LAYOUT
  DISEÑAR LA CONFIGURACIÓN DE CAMPOS PARA ACTIVIDADES (VALIDACIÓN, VALORES POR DEFECTO, ASPECTO, ETC...).
  MEDIACOMPONENT:
    TODO: SI TIENE UN MEDIO SELECCIONADO, MOSTRAR EL NOMBRE
    TODO: IMAGEN: AGREGAR EL TIPO DE IMAGEN -> combo: IMAGEN/ANIMACION
    TODO: AGREGAR UN BUSCADOR DE MEDIOS, QUE PRESENTA LOS RESULTADOS EN UNA TABLA PAGINADA
    ESTUDIAR LA CONVERSIÓN DE MP3 A OGG NODE ffmpeg?
  "resolution": {},
  */

  // Crear una neuva respuesta
  const newElementClick = (opts) => {
    let element = R.clone(element_default);
    const name = 'answer_' + (R.keys(props.state.code[opts.index].elements).length + 1);
    element.id = name;
    props.handleCreateElement(element, opts.index, name);
  };

  // Crear un nuevo modelo
  const newModelElementClick = (opts) => {
    let element = R.clone(element_default);
    const name = 'question';
    element.id = name;
    element.type = 'question_model';
    element.size = {
      "w": 920,
      "h": 80
    }
    element.pos = {
      "x": 1,
      "y": 1
    };
    props.handleCreateElement(element, opts.index, name);
  };

  //Borrar elemento (respuesta o modelo)
  const deleteElementClick = (opts) => {
    props.handleDeleteElement(opts.element, opts.index);
  };

  const getActivityElements = (elements_array, scene_index) => {
    let el_arr = [];
    let has_model = false;
    let btn = '';
    R.mapObjIndexed(function (element, key) {
      if (element.type === 'question_model') {
        has_model = true;
      } else {
        el_arr.push(_getElementContent(element, key, scene_index));
      }
    }, elements_array);
    if (has_model) {
      const model_el = elements_array.question;
      el_arr = R.prepend(_getElementContent(model_el, model_el.id, scene_index), el_arr)
    } else {
      btn = <Button content='Crear Modelo/Pregunta' icon='add circle' labelPosition='left' onClick={newModelElementClick.bind(this, { index: props.index })} />
    }
    return (
      <div>
        {btn}
        <Card.Group key={'main_elements_' + scene_index}>{el_arr}</Card.Group>
      </div>)
  };

  const getMediaImageUrl = (img) => {
    return props.state.media.images[img];
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

  const _getElementContent = (el, el_key, scene_index) => {
    let image = '';
    let sound = '';
    let text = '';
    let fluid = false;
    let meta = <Card.Meta>Tipo: Respuesta - Clickable</Card.Meta>;
    if (el.image) {
      image = <div className='element_media'><Icon name='image' />: <Image key={'image' + el.image} size='mini' src={Helpers.uploadedImage(getMediaImageUrl(el.image))} /></div>
    }
    if (el.sound) {
      sound = <div className='element_media'><Icon name='music' />: {_getSoundName(el.sound)}</div>
    }
    if (el.text) {
      text = <div className='element_media'><Icon name='file text outline' />: {_getElementText(el.text)}</div>
    }
    if (el.type === 'question_model') {
      fluid = true;
      meta = <Card.Meta key={el.type + _.uniqueId()} >Tipo: Pregunta/Modelo</Card.Meta>;
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

  return (
    <div>
      <CheckboxLabeled {...props}
        name={'show_instruction' + _.uniqueId()}
        title='Mostrar la instrucción al iniciar'
        field={['code', index, 'show_instruction']} />
      <SimpleInputText key={'instruction' + _.uniqueId()} {...props}
        name={'instruction_text' + _.uniqueId()}
        title='Instrucción'
        field={['code', index, 'instruction', 'text']} />
      <Form.Field>
        <label>Audio: {props.state.code[props.index].instruction.sound}</label>
      </Form.Field>
      <MediaComponent {...props}
        name={'audio_instruction'}
        title='Añadir medios'
        field={['code', index, 'instruction']}
        options={{
          image: null,
          sound: props.state.code[props.index].instruction.sound,
          text: null,
          enabled: {
            image: false,
            sound: true,
            text: false,
          }
        }} />
      <Divider section />
      <SimpleInputText key={'main_back' + _.uniqueId()} {...props}
        name={'main_back' + _.uniqueId()}
        title='Imagen de Fondo de la actividad :TODO'
        field={['code', index, 'main_back']} />
      <Form.Field>
        <label>Color de fondo de la actividad</label>
      </Form.Field>
      <ColorPicker {...props}
        name={'background_color' + _.uniqueId()}
        key={'background_color' + _.uniqueId()}
        field={['code', index, 'background_color']}
      />
      <Divider section />
      <Form.Group>
        <DropdownSelection {...props}
          name={'type' + _.uniqueId()}
          title='Tipo de pantalla'
          field={['code', index, 'type']}
          options={[
            { key: 'static', value: 0, text: 'Estática/Introducción' },
            { key: 'click', value: 1, text: 'Click' },
            { key: 'dnd', value: 2, text: 'Arrastrar y soltar' },
            { key: 'memory', value: 3, text: 'Memory' },
            { key: 'paint', value: 4, text: 'Paint' }
          ]} />
      </Form.Group>
      <Divider section />
      <Form.Group widths='equal'>
        <Form.Field>
          <label>Botones de navegación</label>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={'btn_home' + _.uniqueId()}
            title='Volver a la home'
            field={['code', index, 'buttons_visible', 'btn_home']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={'btn_redo' + _.uniqueId()}
            title='Rehacer la actividad'
            field={['code', index, 'buttons_visible', 'btn_redo']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={'btn_back' + _.uniqueId()}
            title='Volver Atrás'
            field={['code', index, 'buttons_visible', 'btn_back']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={'btn_next' + _.uniqueId()}
            title='Pasar de pantalla'
            field={['code', index, 'buttons_visible', 'btn_next']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={'btn_info' + _.uniqueId()}
            title='Información'
            field={['code', index, 'buttons_visible', 'btn_info']} />
        </Form.Field>
      </Form.Group>
      <Divider section />
      <Form.Field>
        <label>Contador de tiempo</label>
      </Form.Field>
      <Form.Group widths='equal'>
        <Form.Field>
          <LabeledInputText key={'timer' + _.uniqueId()} {...props}
            name={'time' + _.uniqueId()}
            title='Tiempo'
            field={['code', index, 'timer', 'time']}
            label='ms.'
            label_position='right' />
        </Form.Field>
        <Form.Field>
          <CheckboxLabeled {...props}
            name={'time_visible' + _.uniqueId()}
            title='Visible'
            field={['code', index, 'timer', 'visible']} />
        </Form.Field>
      </Form.Group>
      <Divider section />
      <Form.Field>
        <label>Elementos de la actividad</label>
      </Form.Field>
      <Button content='Crear nuevo elemento' icon='add circle' labelPosition='left' onClick={newElementClick.bind(this, { index: props.index })} />
      {getActivityElements(props.state.code[index].elements, index)}
    </div>
  );
};

export default FormPanel;
