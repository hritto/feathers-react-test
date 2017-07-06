import React from 'react'
import { Checkbox, Form, Input, Label } from 'semantic-ui-react'
import R from 'ramda'

const CheckboxResolution = (props) => {
  const check = (e, result) => {
    props.resolution(props.name, result.checked, props.index)
  }

  let checkd = R.view(R.lensPath(['code', props.index, 'resolution', props.name]), props.state);
  let label = '';
  return (
    <Form.Field>
      <label>{props.title}</label>
      <Checkbox
        name={props.name}
        key={'_' + props.title}
        onChange={check.bind(this)}
        checked={checkd} />
      {label}
    </Form.Field>
  )
}

export default CheckboxResolution
