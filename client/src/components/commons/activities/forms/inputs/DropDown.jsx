import React from 'react'
import { Dropdown, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const DropdownSelection = (props) => {
  const handleChange = (evt, result) => {
    props.change(props.field, result.value);
  }

  console.log(R.view(R.lensPath(props.field), props.state))

  return (
    <Form.Field>
      <label>{props.title}</label>
      <Dropdown placeholder='Seleccionar...'
        selection
        options={props.options}
        onChange={handleChange.bind(this)}
        name={props.name}
        value={R.view(R.lensPath(props.field), props.state)} />
    </Form.Field>)
}

export default DropdownSelection
