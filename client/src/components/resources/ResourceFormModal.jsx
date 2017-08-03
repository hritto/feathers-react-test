import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment, Icon } from 'semantic-ui-react'
import R from 'ramda';
import ResourceForm from './Form.jsx';

const ResourceFormModal = (props) => {
    let txt_action = 'Nuevo Recurso';
    if (props.model.state === 'delete'){
      txt_action = 'Borrar Recurso';
    }
    if (props.model.state === 'update'){
      txt_action = 'Actualizar Recurso';
    }

    return (
        <Modal
            open={true}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
              <ResourceForm {...props} />
            </Modal.Content>
          </Modal>);
};

export default ResourceFormModal;
