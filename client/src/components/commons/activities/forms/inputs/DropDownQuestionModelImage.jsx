import React from 'react'
import { Dropdown, Form, Input, Label, Image } from 'semantic-ui-react'
import R from 'ramda'
const Promise = require("bluebird");

const getLabel = (option) => {
  let label = '';
  switch (option) {
  case 'landscape':
    label = 'Horizontal';
    break;
  case 'portrait':
    label = 'vertical';
    break;
  case 'other':
    label = 'Libre';
    break;
  case 'up':
    label = 'Arriba';
    break;
  case 'down':
    label = 'Abajo';
    break;
  case 'left':
    label = 'Izquierda';
    break;
  case 'right':
    label = 'Derecha';
    break;
  }
  return label;
};

const DropDownQuestionModelImage = (props) => {
  //  ESTO NO TIENE QUE SER UN handleChange
  // ESTO TIENE QUE TENER SU PROPIA FUNCIÓN ESPECÍFICA QUE CAMBIE EL VALOR DE LOS DOS COMBOS
  // y CAMBIE TAMBIEN EL TAMAÑO Y LA POSICIÓN DE LOS ELEMENTOS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const handleChange = (evt, result) => {
    debugger;
    props.change(props.field, result.value);
    if(result.value === 'landscape' && props.parent_field){
      props.change(props.parent_field, 'up');
      props.change(['code', props.index, 'elements', 'question', 'size'], {
        w: 950,
        h: 100
      });
      props.change(['code', props.index, 'elements_container', 'size'], {
        w: 950,
        h: 450
      });
      props.change(['code', props.index, 'elements_container', 'pos'], {
        x: 0,
        y: 100
      });
    }
    if(result.value === 'portrait' && props.parent_field){
      props.change(props.parent_field, 'left');
      props.change(['code', props.index, 'elements', 'question', 'size'], {
        w: 100,
        h: 550
      });
      props.change(['code', props.index, 'elements_container', 'size'], {
        w: 850,
        h: 550
      });
      props.change(['code', props.index, 'elements_container', 'pos'], {
        x: 100,
        y: 0
      });
    }
    if(result.value === 'left'){
      props.change(['code', props.index, 'elements_container', 'size'], {
        w: 850,
        h: 550
      });
      props.change(['code', props.index, 'elements_container', 'pos'], {
        x: 100,
        y: 0
      });
    }
    return Promise.delay(200).then(function(){
        props.calculateLayout(props.index);
    });
  };

  return (
    <Form.Field>
      <label>{props.title}</label>
      <Dropdown placeholder='Seleccionar...'
        trigger={<span>
          <Image size='mini' src={props.image} /> {getLabel(R.view(R.lensPath(props.field), props.state))}
        </span>}
        options={props.options}
        onChange={handleChange.bind(this)}
        name={props.name}
        value={R.view(R.lensPath(props.field), props.state)}
        pointing='top left' icon={null} />
    </Form.Field>);
};

export default DropDownQuestionModelImage
