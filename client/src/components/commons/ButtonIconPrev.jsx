import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import R from 'ramda';

const button = (typ, props) => {
  let icon = "";
  let options = {
    action: typ,
    id: props.record._id,
    props: props,
    state: props.record
  };

  switch (typ) {
    case 'update':
      return <Button key={'btn_' + typ} icon='edit' color='teal' size='tiny' onClick={props.props.controller.itemClick.bind(this, options)} />
    case 'delete':
      return <Button key={'btn_' + typ} icon='delete' color='red' size='tiny' onClick={props.props.controller.itemClick.bind(this, options)} />
    case 'preview':
      return <Button key={'btn_' + typ} icon='unhide' color='blue' size='tiny' onClick={props.props.controller.previewResource.bind(this, options)} />
  }
};


const ButtonIcon = (props) => {
  let btns = ['update', 'delete', 'preview'].map(function (elem) {
    return button(elem, props);
  })
  return (
    <Button.Group style={{ float: 'right' }}>
      {btns}
    </Button.Group>
  )
}

export default ButtonIcon
