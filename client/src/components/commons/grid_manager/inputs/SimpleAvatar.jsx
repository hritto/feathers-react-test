import React from 'react'
import { Form, Image } from 'semantic-ui-react'
import R from 'ramda'

const imageParser = (img) => {
  let default_img = '/assets/images/avatar/small/user_min.png';
  if(img && img.indexOf('assets')>=0){
    return img;
  }
  if(img && img.length){
    return '/uploads/media/'+img;
  }
  return default_img;
};

const SimpleAvatar = (props) => {
  let config = props.props.model.config;
  let el_config = R.find(R.propEq('name', props.campo))(config.fields);
  return (
    <Form.Field>
      <label>{el_config.label}</label>
      <div>
        <Image src={imageParser(props.state.photo)} avatar />
        <span>{props.state.name}</span>
      </div>
    </Form.Field>
)}

export default SimpleAvatar
