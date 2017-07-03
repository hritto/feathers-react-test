import React from 'react'
import { Form, TextArea, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleTextArea = (props) => {
  const handleChange = (lens, evt) => {
    const value = evt.target.value;
    props.change(lens, evt.target.value);
  }

  return (
    <Form.Field>
      <label>{props.title}</label>
      <TextArea placeholder='Escribir la descripción...' key={'_' + props.name}
        type='text'
        name={props.name}
        onChange={handleChange.bind(this, props.field)}
        value={R.view(R.lensPath(props.field), props.state) || ''}
      />
    </Form.Field>
  )
}

export default SimpleTextArea;
