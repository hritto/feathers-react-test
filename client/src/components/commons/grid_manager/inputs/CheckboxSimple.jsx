import React from 'react'
import { Checkbox, Form, Input } from 'semantic-ui-react'
import R from 'ramda'



const CheckboxSimple = (props) => {
  const check = (e, result) => {
    props.change(e, result)
  }
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  let checkd = props.state[props.campo] === 1 ? true : false;
  return (
  <Form.Field>
    <Checkbox
        label={el_config.label}
        name={props.campo}
        key={'_'+props.campo}
        onChange={check.bind(this)}
        checked={checkd} />
  </Form.Field>
  )
}

export default CheckboxSimple
