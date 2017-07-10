import React from 'react';
import { Container, Header, Icon, Menu, Segment } from 'semantic-ui-react';
import TableLayout from '../commons/grid_manager/Table.jsx';
import RibbonHeader from '../commons/header.jsx';
import ClickForm from '../commons/activities/forms/click/ClickForm.jsx';


const TabPanels = (props) => {
  const content = <ClickForm {...props} />;
  return (
    <Segment attached>
      <Menu tabular attached>
        <Menu.Item name='form' active={props.model.tab === 'form'} />
        <Menu.Item name='layout' active={props.model.tab === 'layout'} />
      </Menu>
      {content}
    </Segment>
  )
}

const ActivitiesView = (props) => {
  let cont = <TableLayout {...props} />
  if (props.model.state === 'update') {
    cont = <TabPanels {...props} />
  }
  return (
    <div className="no-margin-absolute">
      <RibbonHeader {...props} />
      <Segment>
        {cont}
      </Segment>
    </div>
  );
}
export default ActivitiesView
