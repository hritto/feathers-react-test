import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputText = (props) => {
  let name_arr = R.join(props.name);

  return (
    <Form.Field>
      <label>{props.field}</label>
      <Input key={'_' + props.field}
        type='text'
        name={props.name}
        onChange={props.change}
        value={R.view(R.lensPath(name_arr), props.state)}
      />
    </Form.Field>
  )
}

export default SimpleInputText
