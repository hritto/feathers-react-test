import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import FormGroup from './grid_manager/Form.jsx'


const ModalView = (props) => {
  if(props.model.state === 'update' || props.model.state === 'create' || props.model.state === 'delete'){
    return (
    <Modal
        open={true}
        onClose={props.controller.closeModal.bind(this, null)}>
      <Modal.Header>{props.model.title}</Modal.Header>
      <Modal.Content>
        <FormGroup {...props} />
      </Modal.Content>
    </Modal>
  )
}
return null;
};

export default ModalView
