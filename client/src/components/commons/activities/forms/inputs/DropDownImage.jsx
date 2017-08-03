import React from 'react'
import { Dropdown, Form, Input, Label, Image } from 'semantic-ui-react'
import R from 'ramda'
const Promise = require("bluebird");

const DropdownImage = (props) => {

  const handleChange = (evt, result) => {
    props.change(props.field, result.value);
  };

  return (
    <Form.Field>
      <label>{props.title}</label>
      <Dropdown placeholder='Seleccionar...'
        trigger={<span>
          <Image size='mini' src={props.image} /> {R.view(R.lensPath(props.field), props.state)}
        </span>}
        options={props.options}
        onChange={handleChange.bind(this)}
        name={props.name}
        value={R.view(R.lensPath(props.field), props.state)}
        pointing='top left' icon={null} />
    </Form.Field>);
};

export default DropdownImage
