import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import R from 'ramda';
import MediaUpload from './activities/forms/inputs/MediaUpload.jsx';


const MediaModalView = (props) => {
    let txt_action = '';
    switch (props.state.addMedia) {
        case 'image':
            txt_action = 'Añadir Imagen';
            break;
        case 'sound':
            txt_action = 'Añadir Audio';
            break;
        case 'text':
            txt_action = 'Añadir Texto';
            break;
    }
    return (
        <Modal
            open={true}
            onClose={props.media.bind(this, { action: null, lens: null })}
            closeOnRootNodeClick={false}>
            <Modal.Header>{txt_action}</Modal.Header>
            <Modal.Content>
                <MediaUpload {...props} />
            </Modal.Content>
        </Modal>
    )
};
export default MediaModalView
