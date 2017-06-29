
import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu } from 'semantic-ui-react';
import SimpleInputText from '../inputs/TextSimple.jsx';
import SimpleInputPassword from '../inputs/PasswordSimple.jsx';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import CheckboxSimple from '../inputs/CheckboxSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import Instruction from '../elements/Instruction.jsx';

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
  */
  //Configuracion general de la escena
  //"menu_url": "../../index.html", //Dónde se va al hacer click en volver
  //"debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
  //"main_el": "main", //El contenedor de la actividad
  //"scene_el": "container", //Contenedor de la escena
  //"main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560) o null (findo x defecto)
  //"show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
  //"type": 3, // 0:dNd, 1:click, 2:paint, 3: pantalla estática que acaba sola con timer //
  /*
  "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
    "btn_home": true,
    "btn_redo": false,
    "btn_back": false,
    "btn_next": false,
  }
  */
  //ELEMENTS
  //Depende del type
  /*
  "timer": { // En realidad se usa solo para la escena 0, pero hay que aprovecharlo para poner
             // Un contador de tiempo
    "time": 500,
    "visible": false
  },
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
    </div>
  );
};

export default FormPanel;

