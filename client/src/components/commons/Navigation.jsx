import React, { Component } from 'react'
import { Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import R from 'ramda';

const colors = ["blue", "teal", "blue", "teal"];

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

const NavigationLayout = (props) => {
  const mapIndexed = R.addIndex(R.map);
  let items = props.model.config || [];
  let menu = mapIndexed(item, items, props);
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
  return (
    <div>
      {menu}
    </div>
  )
};

export default NavigationLayout
