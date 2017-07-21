import React from 'react'
import { Dropdown, Form, Input, Label, Image } from 'semantic-ui-react'
import R from 'ramda'
import LayoutConfig from './layout_click_config.js'
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
  const handleChange = (evt, result) => {
    let config = null;
    props.change(props.field, result.value);
    if(result.value === 'landscape' && props.child_field){
      props.change(props.child_field, 'up');
      config = LayoutConfig().landscapeConfigUp();
    }
    if(result.value === 'portrait' && props.child_field){
      props.change(props.child_field, 'left');
      config = LayoutConfig().portraitConfigLeft();
    }
    if(result.value === 'up'){
      config = LayoutConfig().landscapeConfigUp();
    }
    if(result.value === 'down'){
      config = LayoutConfig().landscapeConfigDown();
    }
    if(result.value === 'left'){
      config = LayoutConfig().portraitConfigLeft();
    }
    if(result.value === 'right'){
      config = LayoutConfig().portraitConfigRight();
    }
    if(result.value === 'other'){
      config = LayoutConfig().configFree();
    }

    props.change(['code', props.index, 'elements', 'question', 'size'], config.question.size);
    props.change(['code', props.index, 'elements', 'question', 'pos'], config.question.pos);
    props.change(['code', props.index, 'elements_container', 'size'], config.elements_container.size);
    props.change(['code', props.index, 'elements_container', 'pos'], config.elements_container.pos);

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
