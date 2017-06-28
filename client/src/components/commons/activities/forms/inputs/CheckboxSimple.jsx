import React from 'react'
import { Checkbox, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const CheckboxSimple = (props) => {
  const check = (e, result) => {
    props.change(e, result)
  }
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  let checkd = props.state[props.campo] === 1 ? true : false;
  let label = ''
  if(el_config.state === 'error'){
    label = <Label basic color='red' pointing='left'>Please enter a value</Label>
  }
  return (
  <Form.Field>
    <Checkbox
        label={el_config.label}
        name={props.campo}
        key={'_'+props.campo}
        onChange={check.bind(this)}
        checked={checkd} />
    {label}
  </Form.Field>
  )
}

export default CheckboxSimple
