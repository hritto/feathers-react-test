import React from 'react'
import { Form, Image } from 'semantic-ui-react'
import R from 'ramda'
import Helpers from '../../helpers.js';


const SimpleAvatar = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  return (
    <Form.Field>
      <label>{el_config.label}</label>
      <div>
        <Image src={Helpers.imageParser(props.state.photo)} avatar />
        <span>{props.state.name}</span>
      </div>
    </Form.Field>
)}

export default SimpleAvatar
