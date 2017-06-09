import React from 'react'
import { Dropdown, Form, Input } from 'semantic-ui-react'
import R from 'ramda'

const DropdownSelection = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  return (
  <Form.Field>
    <label>{el_config.label}</label>
    <Dropdown placeholder='Seleccionar...'
          fluid selection
          options={props.props.model.config.combo_values[props.campo]}
          onChange={props.change}
          name={props.campo}
          value={props.state[props.campo]} />
  </Form.Field>)}

export default DropdownSelection
