
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
import CheckboxResolution from '../inputs/CheckboxResolution.jsx';
import Elements from '../inputs/Elements.jsx';
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
      key: `panel-${index}`,
      title: (<div style={{ display: 'inline' }} key={'container_' + index} >
        {'Escena ' + index}
        <Button type="button" floated='right' color='blue' key={'button_' + index} content='Layout' icon='arrow circle right' size='mini' labelPosition='right' onClick={layoutView.bind(this, { index: index })} />
      </div>),
      content: formClickTemplate(props)
    }
  }
  return {
    key: `panel-${index}`,
    title: (<div style={{ display: 'inline' }} key={'container_' + index} >
      {'Escena ' + index}
      <Button type="button" floated='right' color='blue' key={'button_' + index} content='Layout' disabled icon='arrow circle right' size='mini' labelPosition='right' />
    </div>),
    content: '',
  }
};

const layoutView = (opts) => {
  main_props.props.controller.tabClick('layout');
  return false;
};

const formClickTemplate = (props) => {
  /*
  TIPOS DE ACTIVIDAD:
  0: ESTÁTICA CON O SIN timer
  1: Click
  2: DRAG AN Drop
  3: MEMORY
  4: DIBUJO LIBRE
  //ELEMENTS //Depende del type

  TODO: MANEJAR LOS ELEMENTOS DEPENDIENDO DEL TIPO DE ACTIVIDAD
  TODO:
  -----> FALTA GUARDAR LOS META-DATOS EN EL SERVIDOR
  -----> FALTA CONTROLAR EL LAYOUT AL AGREGAR/QUITAR ELEMENTOS


  DISEÑAR LA CONFIGURACIÓN DE CAMPOS PARA ACTIVIDADES (VALIDACIÓN, VALORES POR DEFECTO, ASPECTO, ETC...).
  MEDIACOMPONENT:
    TODO: IMAGEN: AGREGAR EL TIPO DE IMAGEN -> combo: IMAGEN/ANIMACION
    TODO: AGREGAR UN BUSCADOR DE MEDIOS, QUE PRESENTA LOS RESULTADOS EN UNA TABLA PAGINADA
    ESTUDIAR LA CONVERSIÓN DE MP3 A OGG NODE ffmpeg?

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
    element.layout_type = 'landscape';
    element.layout_position = 'top';
    props.handleCreateElement(element, opts.index, name);
  };

  let back_image = props.state.code[props.index].main_back;
  if (R.type(back_image) === 'Object') {
    back_image = back_image.image;
  }

  return (
    <div>
      <Form.Field>
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
      </Form.Field>
      <Form.Group widths='equal'>
        <SimpleInputText key={'instruction'} {...props}
          name={'instruction_text'}
          title='Instrucción'
          field={['code', index, 'instruction', 'text']} />
      </Form.Group>
      <Form.Group widths='equal'>
        <Form.Field>
          <label>Audio de la instrucción: {props.state.code[props.index].instruction.sound || "Ninguno..."}</label>
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
        </Form.Field>
        <Form.Field>
        <CheckboxLabeled {...props}
          name={'show_instruction'}
          title='Mostrar la instrucción al iniciar'
          field={['code', index, 'show_instruction']} />
        </Form.Field>
      </Form.Group>
      <Divider section />
      <Form.Group widths='equal'>
        <Form.Field>
          <label>Color de fondo de la actividad</label>
          <ColorPicker {...props}
            name={'background_color'}
            key={'background_color'}
            field={['code', index, 'background_color']} />
        </Form.Field>
        <Form.Field>
          <label>Imagen de Fondo de la actividad: {back_image || "Ninguna..."}</label>
          <MediaComponent {...props}
            name={'main_back' + _.uniqueId()}
            title='Imagen de Fondo de la actividad'
            field={['code', index, 'main_back']}
            options={{
              image: props.state.code[props.index].main_back,
              sound: null,
              text: null,
              enabled: {
                image: true,
                sound: false,
                text: false,
              }
            }} />
        </Form.Field>
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
          <LabeledInputText key={'timer'} {...props}
            name={'time'}
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
      <Header as='h3'>
       <Icon name='grid layout' size='tiny' />
       <Header.Content style={{padding:'0 0 0 10px'}}>
         Elementos de la actividad
       </Header.Content>
      </Header>
      <Elements {...props} elements={props.state.code[props.index].elements} />
      <Divider section />
      <Button type='button' content='Crear nuevo elemento' icon='add circle' labelPosition='left' onClick={newElementClick.bind(this, { index: props.index })} />
    </div>
  );
};

export default FormPanel;
