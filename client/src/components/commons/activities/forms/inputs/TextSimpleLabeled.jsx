import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const LabeledInputText = (props) => (
   <Form.Field>
    <label>{props.title}</label>
    <Input key={'_' + props.title}
    label={{ basic: true, content: props.label }}
    labelPosition={props.label_position}
    type='text'
    name={props.name}
    onChange={props.change}
    value={R.view(R.lensPath(props.field), props.state) || ''}
    />
  </Form.Field>
)

export default LabeledInputText
