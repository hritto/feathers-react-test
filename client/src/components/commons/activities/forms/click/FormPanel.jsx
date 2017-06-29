
import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu, Label, Divider } from 'semantic-ui-react';
import SimpleInputText from '../inputs/TextSimple.jsx';
import SimpleInputPassword from '../inputs/PasswordSimple.jsx';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import CheckboxSimple from '../inputs/CheckboxSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import Instruction from '../elements/Instruction.jsx';
import ColorPicker from '../inputs/ColorPicker.jsx';


import R from 'ramda';

let p = [];

const FormPanel = (props) => {
  p = [];
  //Renderizar solo la escena abierta
  if (props.state.active_index === props.index) {
    return {
      title: 'Escena ' + props.index,
      content: formClickTemplate(props),
    }
  }
  return {
    title: 'Escena ' + props.index,
    content: '',
  }
};

const iterate = (obj, stack, props) => {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        p.push(<Header as='h4' key={property + _.uniqueId()}>{property}</Header>)
        iterate(obj[property], stack + '.' + property, props);
      } else {
        props['field_map'] = stack + '.' + property;
        props['field'] = property;
        p.push(<SimpleInputText key={property + _.uniqueId()} {...props} />)
      }
    }
  }
  return p;
}

const formClickTemplate = (props) => {
  let elements = [];

  /*
  "instruction": {
    "text": "Hacemos algo en equipo. Empiezan con A.",
    "sound": "titulo0"
  }
  
  Configuracion general de la escena
  "size": {
    "w": 1000,
    "h": 560
  },
  hidden default--->menu_url": "../../index.html", //Dónde se va al hacer click en volver
  hidden default--->debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
  hidden default--->main_el": "main", //El contenedor de la actividad
  hidden default--->scene_el": "container", //Contenedor de la escena
  */
  
  /*
  "timer": { // En realidad se usa solo para la escena 0, pero hay que aprovecharlo para poner Un contador de tiempo
    "time": 500,
    "visible": false
  },
  //ELEMENTS //Depende del type
  "resolution": {},
  */

  //Configuraciones elementos anexos
  /*
  "init_config": { //Configuración de la ventana inicial (pre inicio)
      "show_intro": true, //Mostrar la ventana inicial al abrir
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
      "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
      "size": {
        "w": 800,
        "h": 500
      },
        "elements": {
          "animation_1": {
            "size": {
              "w": 400,
              "h": 320
            },
            "pos": {
              "x": 50,
              "y": 20
            },
            "type": "image",
            "image": "entrar"
          }

        }
    },
    "end_config": { //Configuración de la ventana final (post resolucion)
      "size": {
        "w": 500,
        "h": 400
      },
      "show_end": false,
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
      "elements": {},
    },

  */
  //{iterate(props.state.code[props.index], 'code.' + props.index, props)}


  return (
    <div>
      <Instruction {...props} />
      <SimpleInputText key={'main_back' + _.uniqueId()} {...props}
          name={R.join('.', ['code', props.index, 'main_back'])} 
          title = 'Imagen de Fondo de la actividad :TODO' 
          field = {['code', props.index, 'main_back']} />
      <Form.Field>
        <label>Color de fondo de la actividad</label>
      </Form.Field>
      <ColorPicker {...props}
          name={R.join('.', ['code', props.index, 'background_color'])} 
          key={'main_back' + _.uniqueId()}
          field={ ['code', props.index, 'background_color'] }
      />
      <Divider section />
      <CheckboxSimple {...props} 
        name={R.join('.', ['code', props.index, 'show_instruction'])} 
        title = 'Mostrar la instrucción al iniciar' 
        field = {['code', props.index, 'show_instruction']}/>
      <Form.Group>
      <DropdownSelection {...props} 
        name={R.join('.', ['code', props.index, 'type'])} 
        title = 'Tipo de actividad' 
        field = {['code', props.index, 'type']}
        options = {[{ key: 'click', value: '1', text: 'Click' }]}
        />
      </Form.Group>
      
      <Form.Group widths='equals'>
        <Form.Field>
          <label>Botones de navegación</label>
        </Form.Field>
        <Form.Field>          
          <CheckboxSimple {...props} 
            name={R.join('.', ['code', props.index, 'buttons_visible','btn_home'])} 
            title = 'Volver a la home' 
            field = {['code', props.index, 'buttons_visible','btn_home']}/>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props} 
            name={R.join('.', ['code', props.index, 'buttons_visible','btn_redo'])} 
            title = 'Rehacer la actividad' 
            field = {['code', props.index, 'buttons_visible','btn_redo']}/>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props} 
            name={R.join('.', ['code', props.index, 'buttons_visible','btn_back'])} 
            title = 'Volver Atrás' 
            field = {['code', props.index, 'buttons_visible','btn_back']}/>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props} 
            name={R.join('.', ['code', props.index, 'buttons_visible','btn_next'])} 
            title = 'Pasar de pantalla' 
            field = {['code', props.index, 'buttons_visible','btn_next']}/>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props} 
            name={R.join('.', ['code', props.index, 'buttons_visible','btn_info'])} 
            title = 'Información' 
            field = {['code', props.index, 'buttons_visible','btn_info']}/>
        </Form.Field>
      </Form.Group>
    </div>
  );
};

export default FormPanel;

