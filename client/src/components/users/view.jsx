import React from 'react'
import { Container, Header, Icon, Button, Segment } from 'semantic-ui-react'
import UsersTable from './UsersTable.jsx';
import RibbonHeader from '../commons/header.jsx';
import ModalView from '../commons/Modal.jsx';

const UsersView = (props) => (
  <div className="no-margin-absolute">
    <RibbonHeader {...props} />
    <Segment attached>

      <ButtonCreate {...props} />
      <UsersTable {...props} />
      <ModalView {...props} />

    </Segment>
  </div>
)

const ButtonCreate = (props) => (
  <div>
    <Button content='Crear nuevo usuario'
      icon='add circle'
      key='new_user'
      className='button_new_user'
      labelPosition='left'
      onClick={props.controller.itemClick.bind(this, { action: 'create' })} />
  </div>
)

export default UsersView
