import React, { Component } from 'react'
import { Segment, Button, Menu, Image, Icon, Header, Label } from 'semantic-ui-react'
import R from 'ramda';
import CommonJS from '../../modules/common/current_user.js';
import Helpers from './helpers.js';

const colors = ["blue", "blue", "blue", "blue", "teal"];

const item = (m, index, props) => {
  let current = props.model.current_item || 0;
  return (
    <Menu.Item
      name={m.title}
      key={m.title}
      active={current === index}
      onClick={props.controller.menuClick.bind(this, index)}>
      <Icon
        color={colors[index]}
        name={m.icon} />
      {m.title}
    </Menu.Item>);
};

const MenuHeader = (data) => (
  <div className="login-info" key="user_data">
    <span>
      <a href="javascript:void(0);" id="show-shortcut">
        <img src={Helpers.imageParser(data.photo)} alt="Yo" className="online" />
        <span>{' '+data.name+' '+data.surname}</span>
      </a>
    </span>
  </div>);


const NavigationLayout = (props) => {
  const mapIndexed = R.addIndex(R.map);
  let items = props.model.config || [];
  let menu = mapIndexed(item, items, props);
  let header = MenuHeader(CommonJS.CurrentUser.getUserData());
  menu.push(<Menu.Item
    name='logout'
    key='logout'
    active={false}
    onClick={props.controller.logoutClick.bind(this)}>
    <Icon
      color='red'
      name='power' />
    Salir
  </Menu.Item>)
  menu.unshift(header);

  return (
    <div>
      {menu}
    </div>
  )
};

export default NavigationLayout
