import React from 'react';
import { Icon, Button, Card, Image, Popup, Divider } from 'semantic-ui-react';
import R from 'ramda';
import Element from './Element.jsx';

let mProps = null;
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
  mProps.handleCreateElement(element, opts.index, name);
};

const Elements = (props) => {
  mProps = props;
  let el_arr = [];
  let has_model = false;
  let btn = '';
  const scene_index = props.index;
  const elements_array = props.elements;

  R.mapObjIndexed(function (element, key) {
    if (element.type === 'question_model') {
      has_model = true;
    } else {
      el_arr.push(<Element {...props} element={element} field={key} key={key} />);
    }
  }, elements_array);

  // Añadir el modelo
  if (has_model) {
    const model_el = elements_array.question;
    el_arr = R.prepend(<Element {...props} element={model_el} field={model_el.id} key={model_el.id} />, el_arr);
  } else {
    if (props.activity_type === 1 || props.activity_type === 2) {
      btn = (<div>
        <Button
          type='button'
          content='Crear Modelo/Pregunta'
          icon='add circle'
          labelPosition='left'
          onClick={newModelElementClick.bind(this, { index: props.index })}
        />
        <Divider section />
      </div>);
    }
  }

  return (
    <div>
      {btn}
      <Card.Group key={'main_elements_' + scene_index}>{el_arr}</Card.Group>
    </div>)
};

export default Elements;
