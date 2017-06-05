import React, { Component } from 'react'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import UserList from './userlist';

const SidebarLeftOverlay = (props) => {
  return (
      <div>
        <Segment inverted className='no-margin' >
          <Header as='header' inverted>
            <div className='no-margin' style={{float: 'right', cursor: 'pointer'}} onClick={props.controller.toggleVisibility.bind(this, props.model.visible)}>
              <Icon size='small' name='align justify' inverted />
            </div>
            Header Content
          </Header>
        </Segment>
        <Sidebar.Pushable as={Segment} className='no-margin' >
          <Sidebar as={Menu} animation='overlay' width='thin' visible={props.model.visible} icon='labeled' vertical inverted id='main_menu2'>
            <Menu.Item name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <div id='main_content'>
                  <UserList {...props.model} />
              </div>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
};

export default SidebarLeftOverlay
