import React from 'react';
import { Container, Header, Icon, Menu, Segment, Button, Modal } from 'semantic-ui-react';
import ExpandableLayout from './ExpandableView.jsx';
import RibbonHeader from '../commons/header.jsx';
import WorkPlanFormModal from './WorkPlanFormModal.jsx'

const newWorkPlan = (props) => {
  props.controller.itemClick({
    action: 'create'
  });
};

const WorkPlansView = (props) => {
  let cont = <ExpandableLayout {...props} />
  let modal = '';
  let btn = (<Button primary type='button'
    key={'button_new_activity'}
    className='button_new_activity'
    onClick={newWorkPlan.bind(this, props)}
    content='Crear Nuevo Plan de trabajo' icon='add circle' labelPosition='left' />);
  if (props.model.state === 'update' || props.model.state === 'create' || props.model.state === 'delete') {
    modal = <WorkPlanFormModal {...props} />
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
export default WorkPlansView;
