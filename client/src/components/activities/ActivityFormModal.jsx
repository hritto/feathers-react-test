import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment, Icon } from 'semantic-ui-react'
import R from 'ramda';
import ActivityForm from './Form.jsx';

const ActivityFormModal = (props) => {
    let txt_action = 'Nueva Actividad';
    if (props.model.state === 'delete'){
      txt_action = 'Borrar Actividad';
    }

    return (
        <Modal
            open={true}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
              <ActivityForm {...props} />
            </Modal.Content>
          </Modal>);
};

export default ActivityFormModal;
