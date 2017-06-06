import React from 'react';
import ReactDOM from 'react-dom';
import SidebarLeftPush from './SidebarLeftPush.jsx';
import styles from '../../../assets/css/main_style.css';

const MainLayout = (props) => (
    <div className="AppContainer">
      <SidebarLeftPush {...props}/>
    </div>
  );

export default MainLayout;
