
import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu, Label, Divider, Card, Image, Popup } from 'semantic-ui-react';
import SimpleInputText from '../inputs/TextSimple.jsx';
import SimpleInputPassword from '../inputs/PasswordSimple.jsx';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import CheckboxSimple from '../inputs/CheckboxSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import Instruction from '../elements/Instruction.jsx';
import ColorPicker from '../inputs/ColorPicker.jsx';
import LabeledInputText from '../inputs/TextSimpleLabeled.jsx';
import CheckboxLabeled from '../inputs/CheckboxLabeled.jsx';
import Helpers from './helpers.js';
import MediaComponent from '../inputs/MediaComponent.jsx'

import R from 'ramda';

let p = [];
let main_props = null;

const FormPanel = (props) => {
  p = [];
  main_props = props;
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

const formClickTemplate = (props) => {
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
  //ELEMENTS //Depende del type
  "resolution": {},
  */
  //{iterate(props.state.code[props.index], 'code.' + props.index, props)}

  const newElementClick = (opts) => {
    debugger;
  };

  const deleteElementClick = (opts) => {
    debugger;
  };

  const getActivityElements = (elements_array, scene_index) => {
    let el_arr = [];
    R.mapObjIndexed(function (element, key) {
      el_arr.push(_getElementContent(element, key, scene_index));
    }, elements_array);
    return <Card.Group key={'main_elements_' + scene_index}>{el_arr}</Card.Group>
  };

  const getMediaImageUrl = (img) => {
    return props.state.media.images[img];
  };

  const _getElementContent = (el, el_key, scene_index) => {
    let image = '';
    let meta = <Card.Meta>Tipo: Respuesta - Clickable</Card.Meta>;
    if (el.image) {
      image = <Image key={'image' + el.image} floated='right' size='mini' src={Helpers.uploadedImage(getMediaImageUrl(el.image))} />
    }
    if (el.type === 'question_model') {
      meta = <Card.Meta key={el.type + _.uniqueId()} >Tipo: Pregunta/Modelo</Card.Meta>;
    }
    return (<Card key={'element_' + el.id}>
      <Card.Content key={'content_' + _.uniqueId()}>
        {image}
        <Card.Header key={'header_' + _.uniqueId()}>
          {el.id}
        </Card.Header>
        {meta}
        <Card.Description>
          <Popup
            trigger={<Button circular icon='remove circle' floated='right' onClick={deleteElementClick.bind(this, { action: 'delete', element: el.id })} />}
            content='Borrar elemento.'
            on='hover'
          />
        </Card.Description>
      </Card.Content>
      <Card.Content extra key={'extra_content_' + _.uniqueId()}>
        <MediaComponent {...props}
          name={R.join('.', ['code', scene_index, 'elements', el_key])}
          title='Mostrar la instrucción al iniciar'
          field={['code', scene_index, 'elements', el_key]}
          options={{
            image: el.image,
            sound: el.sound,
            text: el.text
          }} />
      </Card.Content>
    </Card>)
  };

  const elements = getActivityElements(props.state.code[props.index].elements, props.index);

  return (
    <div>
      <Instruction {...props} />
      <SimpleInputText key={'main_back' + _.uniqueId()} {...props}
        name={R.join('.', ['code', props.index, 'main_back'])}
        title='Imagen de Fondo de la actividad :TODO'
        field={['code', props.index, 'main_back']} />
      <Form.Field>
        <label>Color de fondo de la actividad</label>
      </Form.Field>
      <ColorPicker {...props}
        name={R.join('.', ['code', props.index, 'background_color'])}
        key={'main_back' + _.uniqueId()}
        field={['code', props.index, 'background_color']}
      />
      <Divider section />
      <CheckboxSimple {...props}
        name={R.join('.', ['code', props.index, 'show_instruction'])}
        title='Mostrar la instrucción al iniciar'
        field={['code', props.index, 'show_instruction']} />
      <Form.Group>
        <DropdownSelection {...props}
          name={R.join('.', ['code', props.index, 'type'])}
          title='Tipo de actividad'
          field={['code', props.index, 'type']}
          options={[{ key: 'click', value: '1', text: 'Click' }]}
        />
      </Form.Group>
      <Divider section />
      <Form.Group widths='equal'>
        <Form.Field>
          <label>Botones de navegación</label>
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={R.join('.', ['code', props.index, 'buttons_visible', 'btn_home'])}
            title='Volver a la home'
            field={['code', props.index, 'buttons_visible', 'btn_home']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={R.join('.', ['code', props.index, 'buttons_visible', 'btn_redo'])}
            title='Rehacer la actividad'
            field={['code', props.index, 'buttons_visible', 'btn_redo']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={R.join('.', ['code', props.index, 'buttons_visible', 'btn_back'])}
            title='Volver Atrás'
            field={['code', props.index, 'buttons_visible', 'btn_back']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={R.join('.', ['code', props.index, 'buttons_visible', 'btn_next'])}
            title='Pasar de pantalla'
            field={['code', props.index, 'buttons_visible', 'btn_next']} />
        </Form.Field>
        <Form.Field>
          <CheckboxSimple {...props}
            name={R.join('.', ['code', props.index, 'buttons_visible', 'btn_info'])}
            title='Información'
            field={['code', props.index, 'buttons_visible', 'btn_info']} />
        </Form.Field>
      </Form.Group>
      <Divider section />
      <Form.Field>
        <label>Contador de tiempo</label>
      </Form.Field>
      <Form.Group widths='equal'>
        <Form.Field>
          <LabeledInputText key={'timer' + _.uniqueId()} {...props}
            name={R.join('.', ['code', props.index, 'timer', 'time'])}
            title='Tiempo'
            field={['code', props.index, 'timer', 'time']}
            label='ms.'
            label_position='right' />
        </Form.Field>
        <Form.Field>
          <CheckboxLabeled {...props}
            name={R.join('.', ['code', props.index, 'timer', 'visible'])}
            title='Visible'
            field={['code', props.index, 'timer', 'visible']} />
        </Form.Field>
      </Form.Group>
      <Divider section />
      <Form.Field>
        <label>Elementos de la actividad</label>
      </Form.Field>
      <Button content='Crear nuevo elemento' icon='add circle' labelPosition='left' onClick={newElementClick.bind(this, { action: 'create' })} />
      {elements}
    </div>
  );
};

export default FormPanel;

