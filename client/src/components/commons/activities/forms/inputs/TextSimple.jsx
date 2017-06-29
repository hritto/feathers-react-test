import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputText = (props) => {
  return (
    <Form.Field>
      <label>{props.field}</label>
      <Input key={'_' + props.field}
        type='text'
        name={R.join('.', props.field_map)}
        onChange={props.change}
        value={R.view(R.lensPath(props.field_map), props.state)}
      />
    </Form.Field>
  )
}

export default SimpleInputText
