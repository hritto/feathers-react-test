import React from 'react'
import { Container, Header, Icon, Button } from 'semantic-ui-react'
import UsersTable from './UsersTable.jsx';
import RibbonHeader from '../commons/header.jsx';
import ModalView from '../commons/Modal.jsx';

const UsersView = (props) => (
  <div className="no-margin-absolute">
    <RibbonHeader {...props} />
    <Container fluid className="padding-10">
      <ButtonCreate {...props} />
      <UsersTable {...props} />
      <ModalView {...props} />
    </Container>
  </div>
)

const ButtonCreate = (props) => (
  <div>
    <Button content='Crear nuevo usuario' icon='add circle' labelPosition='left' onClick={props.controller.itemClick.bind(this, {action: 'create'})} />
  </div>
)

export default UsersView
