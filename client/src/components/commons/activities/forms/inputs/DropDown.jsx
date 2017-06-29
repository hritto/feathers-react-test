import React from 'react'
import { Dropdown, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const DropdownSelection = (props) => {
  let lens = props.field;
  return (
  <Form.Field>
    <label>{props.title}</label>
    <Dropdown placeholder='Seleccionar...'
          fluid selection
          options={props.options}
          onChange={props.select}
          name={props.name}
          value={R.view(R.lensPath(props.field), props.state)} />
  </Form.Field>)
}

export default DropdownSelection
