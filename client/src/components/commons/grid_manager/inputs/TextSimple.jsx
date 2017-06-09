import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputText = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  return (
  <Form.Field>
    <label>{el_config.label}</label>
    <Input key={'_'+props.campo}
        type='text'
        name={props.campo}
        onChange={props.change}
        value={props.state[props.campo]} />
  </Form.Field>
  )
}

export default SimpleInputText
