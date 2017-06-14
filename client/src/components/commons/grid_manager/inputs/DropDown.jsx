import React from 'react'
import { Dropdown, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const DropdownSelection = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  let label = ''
  if(el_config.state === 'error'){
    label = <Label basic color='red' pointing='below'>{el_config.message}</Label>
  }
  return (
  <Form.Field>
    <label>{el_config.label}</label>
    {label}
    <Dropdown placeholder='Seleccionar...'
          fluid selection
          options={props.props.model.config.combo_values[props.campo]}
          onChange={props.change}
          name={props.campo}
          value={props.state[props.campo]} />
  </Form.Field>)}

export default DropdownSelection
