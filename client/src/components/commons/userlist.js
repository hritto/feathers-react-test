import React from 'react';
import ReactDOM from 'react-dom';
import { Image, List } from 'semantic-ui-react'

const listItems = (rec) => {
  return rec.map((number) =>
  <List.Item key={number._id}>
    <Image avatar src='/assets/images/avatar/small/helen.jpg' />
    <List.Content>
      <List.Header>{number._id + ":  " + number.email}</List.Header>
    </List.Content>
  </List.Item>
)};

const UserList = (props) => {
  let list = listItems(props.records);
  return <List animated verticalAlign='middle'>
            {list}
        </List>
};

export default UserList;
