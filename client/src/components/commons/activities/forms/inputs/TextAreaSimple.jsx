import React from 'react'
import { Form, TextArea, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleTextArea = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  if(el_config.state === 'error'){
    return (
    <Form.Field>
      <label>{el_config.label}</label>
      <Label basic color='red' pointing='below'>{el_config.message}</Label>
      <TextArea error placeholder='Escribir...' autoHeight
        key={'_'+props.campo}
        name={props.campo}
        onChange={props.change}
        value={props.state[props.campo]} />
    </Form.Field>
    )
  }
  return (
  <Form.Field>
    <label>{el_config.label}</label>
    <TextArea placeholder='Escribir...' autoHeight
      key={'_'+props.campo}
      name={props.campo}
      onChange={props.change}
      value={props.state[props.campo]} />
  </Form.Field>
  )
}

export default SimpleTextArea
