import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';

const Container = children => (<div className="panel panel-default">
  <div className="panel-body">
    {children}
  </div>
</div>);

const List = children => (<ul>
  {children}
</ul>);

const ListItem = (props) => {
  return (
    <li key={props._id}>
      <span key={"sp_"+props._id}>{props._id + ":  " + props.email}</span>
    </li>
  )};

const UserList = R.compose(Container, List, R.map(ListItem), R.prop('users'));

export default UserList;
