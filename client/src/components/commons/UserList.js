import React from 'react';
import ReactDOM from 'react-dom';
import { Image, List } from 'semantic-ui-react'
import ButtonIcon from './ButtonIcon.jsx'

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

const listItems = (props) => {
  let records = props.model.records || [];
  let url_image = '/assets/images/avatar/small/user_min.png';
  return records.map((record) =>
  <List.Item key={record._id}>
    <Image avatar src={imageParser(record.photo)} />
    <List.Content verticalAlign='middle' style={{width: '600px'}}>
      <div className='list_span'>{record.name + " " + record.surname + ":  " + record.email}{' '}</div><ButtonIcon {...props} id={record._id} />
    </List.Content>
  </List.Item>
)};

const getModal = (props) => {
  switch (props.model.state) {
    case "edit":
      return "";
      break;
    default:
      return "";
      break;
  }
};

const UserList = (props) => {
  let list = listItems(props);
  let modal = getModal(props);
  return (<List selection verticalAlign='middle'>
            {list}
        </List>);
};

export default UserList;
