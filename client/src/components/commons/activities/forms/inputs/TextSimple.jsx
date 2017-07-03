import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'


const SimpleInputText = (props) => {
  const handleChange = (lens, evt) => {
    const value = evt.target.value;
    props.change(lens, evt.target.value);
  }

  return (
    <Form.Field>
      <label>{props.title}</label>
      <Input key={'_' + props.title}
        type='text'
        name={props.name}
        onChange={handleChange.bind(this, props.field)}
        value={R.view(R.lensPath(props.field), props.state) || ''}
      />
    </Form.Field>
  )
}

export default SimpleInputText
