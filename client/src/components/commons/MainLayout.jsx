import React from 'react';
import ReactDOM from 'react-dom';
import SidebarLeftPush from './SidebarLeftPush.jsx';
import SidebarLeftOverlay from './SidebarLeftOverlay.jsx';
import styles from '../../../assets/css/main_style.css';
/*
import R from 'ramda';
import UserList from './userlist';

const MainLayout = (props) => {
  return (<div className="container">
    <h1>Users</h1>
    <UserList users={props.model.records} />
    <button className="btn btn-xs btn-default table_btn_upd" data-original-title="Add" key='btn_add' onClick={props.controller.onAddClick.bind(this)}>
      Add
    </button>
  </div>);
};

MainLayout.render = R.curry((node, props) => ReactDOM.render(<MainLayout {...props}/>, node));

export default MainLayout;
*/

const getSidebar = (layout, props) => layout === "wide" ? <SidebarLeftPush {...props}/> : <SidebarLeftOverlay {...props}/>

const MainLayout = (props) => {
  let sidebar = getSidebar(props.model.layout, props);
  return (
    <div className="AppContainer">
      {sidebar}
    </div>
  );
};

export default MainLayout;
