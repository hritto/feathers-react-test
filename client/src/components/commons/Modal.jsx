import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import FormGroup from './grid_manager/Form.jsx'


const ModalView = (props) => {
  let txt_action = '';
  if(props.model.state === 'update' || props.model.state === 'create' || props.model.state === 'delete'){
    switch (props.model.state) {
    case 'update':
      txt_action = 'Actualizar ';
      break;
    case 'create':
      txt_action = 'Crear ';
      break;
    case 'delete':
      txt_action = 'Borrar ';
      break;
    default:
      txt_action = 'Actualizar: ';
      break;
    }
    return (
    <Modal
        open={true}
        onClose={props.controller.closeModal.bind(this, null)}>
      <Modal.Header>{txt_action + props.model.title}</Modal.Header>
      <Modal.Content>
        <FormGroup {...props} />
      </Modal.Content>
    </Modal>
  )
}
return null;
};

export default ModalView
