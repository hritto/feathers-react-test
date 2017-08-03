import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment, Icon } from 'semantic-ui-react'
import R from 'ramda';
import PreviewView from './Preview.jsx';

const close = (props) => {
  props.controller.closeModal();
};

const PreviewModal = (props) => {
    let txt_action = 'Preview';
    return (
        <Modal
          open={true}
          size='fullscreen'
          closeIcon='close'
          onClose={close.bind(this, props)}
          closeOnRootNodeClick={false}>
          <Modal.Header>{txt_action}</Modal.Header>
          <Modal.Content>
            <PreviewView {...props} />
          </Modal.Content>
        </Modal>);
};

export default PreviewModal;
