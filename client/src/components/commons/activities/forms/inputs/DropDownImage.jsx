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

const DropdownImage = (props) => {

  const handleChange = (evt, result) => {
    props.change(props.field, result.value);
    if(result.value === 'landscape' && props.parent_field){
      props.change(props.parent_field, 'up');
    }
    if(result.value === 'portrait' && props.parent_field){
      props.change(props.parent_field, 'left');
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

export default DropdownImage
