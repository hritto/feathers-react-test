import React from 'react';
import { Container, Header, Icon, Menu, Segment, Button, Modal } from 'semantic-ui-react';
import TableLayout from './Table.jsx';
import RibbonHeader from '../commons/header.jsx';
import ResourceFormModal from './ResourceFormModal.jsx'

const newResource = (props) => {
  props.controller.itemClick({
    action: 'create'
  });
};

const ResourcesView = (props) => {
  let cont = <TableLayout {...props} />
  let modal = '';
  let btn = (<Button primary type='button'
    key={'button_new_activity'}
    className='button_new_activity'
    onClick={newResource.bind(this, props)}
    content='Crear Nuevo Recurso' icon='add circle' labelPosition='left' />);
  if (props.model.state === 'update' || props.model.state === 'create' || props.model.state === 'delete') {
    modal = <ResourceFormModal {...props} />
  }
  return (
    <div className="no-margin-absolute">
      <RibbonHeader {...props} />
      {modal}
      <Segment attached>
        {btn}
        {cont}
      </Segment>
    </div>
  );
}
export default ResourcesView
