import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'semantic-ui-react';
import Helpers from './helpers.js';

const getStyle = (avatar, props) => {
  if(Helpers.imageParser(props.sel) === Helpers.imageParser(avatar.url)){
    return {
      border: '3px solid green'
    };
  }
  return {
    border: 'none'
  };
};

const cardItems = (props) => {
  const avatars = props.model.avatars || [];
  return avatars.map((avatar) =>
  <Card key={avatar._id} raised style={getStyle(avatar, props)} image={Helpers.imageParser(avatar.url)} onClick={props.avatarSelected.bind(this, {id: avatar._id, url: avatar.url})} />
)};

const AvatarSelector = (props) => {
  return (<Card.Group itemsPerRow={10} className="card_selector">
            {cardItems(props)}
        </Card.Group>);
};

export default AvatarSelector;
