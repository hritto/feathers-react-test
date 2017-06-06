import React from 'react';
import ReactDOM from 'react-dom';
import { Image, List } from 'semantic-ui-react'

const listItems = (rec) => {
  let records = rec || [];
  return records.map((record) =>
  <List.Item key={record._id}>
    <Image avatar src='/assets/images/avatar/small/user_min.png' />
    <List.Content>
      <List.Header>{record._id + ":  " + record.email}</List.Header>
    </List.Content>
  </List.Item>
)};

const UserList = (props) => {
  let list = listItems(props.model.records);
  return <List animated verticalAlign='middle'>
            {list}
        </List>
};

export default UserList;
