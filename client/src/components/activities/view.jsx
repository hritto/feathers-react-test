import React from 'react';
import { Container, Header, Icon, Menu, Segment, Button, Modal } from 'semantic-ui-react';
import TableLayout from '../commons/grid_manager/Table.jsx';
import RibbonHeader from '../commons/header.jsx';
import ClickForm from '../commons/activities/forms/click/ClickForm.jsx';
import ActivityFormModal from './ActivityFormModal.jsx'


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

const newActivity = (props) => {
  props.controller.itemClick({
    action: 'create'
  });
};

const ActivitiesView = (props) => {
  let cont = <TableLayout {...props} />
  let modal = '';
  let btn = (<Button primary type='button'
    key={'button_new_activity'}
    className='button_new_activity'
    onClick={newActivity.bind(this, props)}
    content='Crear Nueva Actividad' icon='add circle' labelPosition='left' />);
  if (props.model.state === 'update') {
    cont = <TabPanels {...props} />
    btn = '';
  }
  if (props.model.state === 'create' || props.model.state === 'delete') {
    modal = <ActivityFormModal {...props} />
  }
  return (
    <div className="no-margin-absolute">
      <RibbonHeader {...props} />
      {modal}
      <Segment>
        {btn}
        {cont}
      </Segment>
    </div>
  );
}
export default ActivitiesView
