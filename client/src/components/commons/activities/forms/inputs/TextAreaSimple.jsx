import React from 'react'
import { Form, TextArea, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleTextArea = (props) => {


  return (
    <Form.Field>
      <label>{props.title}</label>
      <TextArea placeholder='Escribir la descripción...' key={'_' + props.name}
        type='text'
        name={props.name}
        onChange={props.change}
        value={R.view(R.lensPath(props.field), props.state) || ''}
      />
    </Form.Field>
  )
}

export default SimpleTextArea;
