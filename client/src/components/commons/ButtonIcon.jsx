import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import R from 'ramda';

const button = (typ, props) => {
  let icon = "";
  let options = {
    action: typ,
    id: props.record._id
  };

  switch (typ) {
  case 'update':
    return <Button key={'btn_'+typ} icon='edit' size='tiny' onClick={props.props.controller.itemClick.bind(this, options)} />
  case 'delete':
    return <Button key={'btn_'+typ} icon='delete' size='tiny' onClick={props.props.controller.itemClick.bind(this, options)} />
  }
};


const ButtonIcon = (props) => {
  let btns = ['update','delete'].map(function(elem){
    return button(elem, props);
  })
  return (
  <Button.Group style={{float: 'right'}}>
    {btns}
  </Button.Group>
)}

export default ButtonIcon
