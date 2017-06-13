import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'semantic-ui-react'

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

const cardItems = (props) => {
  const avatars = props.model.avatars || [];
  return avatars.map((avatar) =>
  <Card key={avatar._id} raised image={imageParser(avatar.url)} onClick={props.avatarSelected.bind(this, {id: avatar._id, url: avatar.url})} />
)};

const AvatarSelector = (props) => {
  let list = cardItems(props);
  return (<Card.Group itemsPerRow={10}>
            {list}
        </Card.Group>);
};

export default AvatarSelector;
