import React from 'react';
import ReactDOM from 'react-dom';
import { Image, List } from 'semantic-ui-react';
import ButtonIcon from './ButtonIcon.jsx';
import Helpers from './helpers.js';

const listItems = (props) => {
  let records = props.model.records || [];
  let url_image = '/assets/images/avatar/small/user_min.png';
  return records.map((record) =>
  <List.Item key={record._id}>
    <Image avatar src={Helpers.imageParser(record.photo)} />
    <List.Content verticalAlign='middle' style={{width: '600px'}}>
      <div className='list_span'>{record.name + " " + record.surname + ":  " + record.email}{' '}</div><ButtonIcon {...props} id={record._id} />
    </List.Content>
  </List.Item>
)};

const UserList = (props) => {
  let list = listItems(props);
  return (<List selection verticalAlign='middle'>
            {list}
        </List>);
};

export default UserList;
