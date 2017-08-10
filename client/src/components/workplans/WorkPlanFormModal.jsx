import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment, Icon } from 'semantic-ui-react'
import R from 'ramda';
import WorkPlansForm from './Form.jsx';

const WorkPlansFormModal = (props) => {
    let txt_action = 'Nuevo Plan de trabajo';
    if (props.model.state === 'delete'){
      txt_action = 'Borrar Plan de trabajo';
    }
    if (props.model.state === 'update'){
      txt_action = 'Actualizar Plan de trabajo';
    }

    return (
        <Modal
            open={true}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
              <WorkPlansForm {...props} />
            </Modal.Content>
          </Modal>);
};

export default WorkPlansFormModal;
