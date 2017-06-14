import React from 'react';
import ReactDOM from 'react-dom';
import SidebarLeftPush from './SidebarLeftPush.jsx';

const MainLayout = (props) => (
    <div className="AppContainer">
      <SidebarLeftPush {...props}/>
      <footer><p>For more info... ask your Grandma. Thanks!</p></footer>
    </div>
  );

export default MainLayout;
