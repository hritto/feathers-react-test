import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import R from 'ramda'

const SimpleTextArea = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
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
