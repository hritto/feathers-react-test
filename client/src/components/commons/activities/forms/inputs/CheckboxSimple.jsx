import React from 'react'
import { Checkbox, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const CheckboxSimple = (props) => {
  const check = (e, result) => {
    props.check(e, result)
  }
  
  let lens = props.field;
  let checkd = R.view(R.lensPath(lens), props.state) ? true : false;
  let label = ''
  return (
  <Form.Field>
    <Checkbox
        label={props.title}
        name={props.name}
        key={'_' + props.title}
        onChange={check.bind(this)}
        checked={checkd} />
    {label}
  </Form.Field>
  )
}

export default CheckboxSimple
