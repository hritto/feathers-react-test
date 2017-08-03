import React from 'react'
import { Dropdown, Form, Input, Button, Label } from 'semantic-ui-react'
import R from 'ramda'

const DropdownButton = (props) => {
  const handleChange = (evt, result) => {
    props.change(props.field, result.value);
  }
  return (
    <Form.Field>
      <label>{props.title}</label>
      <Dropdown placeholder='Seleccionar...'
        inline
        options={props.options}
        onChange={handleChange.bind(this)}
        name={props.name}
        value={R.view(R.lensPath(props.field), props.state)} />
      <Button type='button' content='Añadir' onClick={props.handleAddScene} secondary disabled={props.state.new_scene_type === null}/>
    </Form.Field>)
}

export default DropdownButton;
