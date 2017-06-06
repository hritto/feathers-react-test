import React from 'react'
import { Container, Header, Icon } from 'semantic-ui-react'
import UserList from '../../components/commons/UserList.js';
import RibbonHeader from '../commons/header.jsx';

const UsersView = (props) => (
  <div className="no-margin-absolute">
    <RibbonHeader {...props} />
    <Container fluid className="padding-10">
      <UserList {...props} />
    </Container>
  </div>
)


export default UsersView
