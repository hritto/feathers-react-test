import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputPassword = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  if(el_config.state === 'error'){
    return (<Form.Field>
      <label>{el_config.label}</label>
      <Label basic color='red' pointing='below'>{el_config.message}</Label>
      <Input error key={'_'+props.campo}
          type='password'
          name={props.campo}
          onChange={props.change}
          value={props.state[props.campo]} />
    </Form.Field>)
  }
  return (
  <Form.Field>
    <label>{el_config.label}</label>
    <Input key={'_'+props.campo}
        type='password'
        name={props.campo}
        onChange={props.change}
        value={props.state[props.campo]} />
  </Form.Field>
  )
}

export default SimpleInputPassword
