import React from 'react'
import { Container, Header, Icon } from 'semantic-ui-react'
import TableLayout from '../commons/grid_manager/Table.jsx';
import RibbonHeader from '../commons/header.jsx';

const ActivitiesView = (props) => (
  <div className="no-margin-absolute">
    <RibbonHeader {...props} />
    <Container fluid className="padding-10">
      <TableLayout {...props} />
    </Container>
  </div>
)


export default ActivitiesView
