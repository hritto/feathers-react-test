import React, { Component } from 'react'
import { Sidebar, Container, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

const SidebarLeftPush = (props) => {
  return (
    <div>
      <Segment inverted className='no-margin' >
        <Header as='header' inverted>
          <div className='no-margin' style={{ float: 'right', cursor: 'pointer' }} onClick={props.controller.toggleVisibility.bind(this, props.model.visible)}>
            <Icon size='small' name='align justify' inverted className='close_icon' />
          </div>
        {/*<img className='header_logo' src='../assets/images/vivitbooks_logo.png' />*/}
        Header Content
        </Header>
      </Segment>
      <Sidebar.Pushable as={Segment} className='no-margin' >
        <Sidebar as={Menu} animation={props.model.animation} width='thin' visible={props.model.visible} icon='labeled' vertical inverted id='main_menu'>
          <div id='menu_items'></div>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic className="no-margin-absolute">
            <div id='main_content' />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
};

export default SidebarLeftPush
