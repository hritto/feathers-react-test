import React from 'react'
import { Button, Header, Image, Modal, Menu, Item, Segment } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import R from 'ramda';
import MediaUpload from './activities/forms/inputs/MediaUpload.jsx';
import FilterMedia from './FilterMedia.jsx';

const TabPanels = (props) => {
  let content = '';
  if(props.state.media_tab === 'table') {
    content = <FilterMedia {...props} />
  } else {
    content = <MediaUpload {...props} />
  }
  return (
    <div>
      <Menu tabular attached>
        <Menu.Item name='Buscar' active={props.state.media_tab === 'table'} onClick={props.media_tab.bind(this, 'table')} />
        <Menu.Item name='Subir' active={props.state.media_tab === 'upload'} onClick={props.media_tab.bind(this, 'upload')} />
      </Menu>
      {content}
    </div>
  )
}


const MediaModalView = (props) => {
    let txt_action = '';
    let modal_content = '';
    switch (props.state.mediatype) {
        case 'image':
            txt_action = 'Añadir o Cambiar Imagen';
            break;
        case 'audio':
            txt_action = 'Añadir o Cambiar Audio';
            break;
        case 'text':
            txt_action = 'Añadir o Cambiar Texto';
            break;
    }

    modal_content = <TabPanels {...props} />
    return (
        <Modal
            open={true}
            onClose={props.media.bind(this, { action: null, lens: null })}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
                {modal_content}
            </Modal.Content>
        </Modal>
    )
};
export default MediaModalView
