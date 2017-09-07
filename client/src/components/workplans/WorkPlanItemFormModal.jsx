import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment, Icon } from 'semantic-ui-react'
import R from 'ramda';
import WorkPlanItemsForm from './WorkplanItemForm.jsx';

const WorkPlanItemFormModal = (props) => {
    let txt_action = 'Añadir elemento al plan de trabajo';
    if (props.model.state === 'delete_plan_item'){
      txt_action = 'Borrar elemento del plan de trabajo';
    }

    return (
        <Modal
            open={true}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
              <WorkPlanItemsForm {...props} />
            </Modal.Content>
          </Modal>);
};

export default WorkPlanItemFormModal;
