import React from 'react';
import ReactDOM from 'react-dom';
import { Image, List } from 'semantic-ui-react'
import ModalTest from './ButtonIcon.jsx'

const listItems = (rec) => {
  let records = rec || [];
  return records.map((record) =>
  <List.Item key={record._id}>
    <Image avatar src='/assets/images/avatar/small/user_min.png' />
    <List.Content verticalAlign='middle'>
      <div className='list_span'>{record.role + ":  " + record.email}{' '}</div><ModalTest props={{icon: 'edit'}} />

    </List.Content>
  </List.Item>
)};

const UserList = (props) => {
  let list = listItems(props.model.records);
  return (<List animated verticalAlign='middle'>
            {list}
        </List>);
};

export default UserList;
