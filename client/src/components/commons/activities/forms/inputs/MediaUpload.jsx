import React, { Component } from 'react';
import { Form, Button, Menu, Segment, Message } from 'semantic-ui-react';
import SimpleInputText from './TextSimple.jsx';
import SimpleTextArea from './TextAreaSimple.jsx';
import DropzoneComponent from 'react-dropzone-component';
import R from 'ramda';
import Promise from 'bluebird';
import uploadService from '../../../../../modules/common/feathers_client_io.js'


let myDropzone = null;
let myProps = null;
let error_message = null;
let message = '';

const handleSubmit = () => {
    if (!myProps.state.media_name || myProps.state.media_name === '') {
        error_message = {
            header: "Es necesario añadir un nombre del fichero.",
            text: "Ese nombre le permitirá luego buscarlo en el diccionario de Medios. Rellene el nombre y vuelva a intentarlo.",
            type: 'upload_name_missing'
        };
        myProps.error(error_message);
    } else {
        error_message = null;
        myDropzone.processQueue();
    }
    return false;
};

const closeModal = () => {
    myProps.media({
        addMedia: null,
        media_lens: [],
        media_name: '',
        media_description: '',
        error_messages: []
    });
};

const getMediaName = (props) => {
  return props.state.media_name || 'Ninguno...';
};

const MediaUpload = (props) => {
    myProps = props;
    let iconFiletypes = ['.jpg', '.png', '.gif'];
    let acceptedFiles = ".png,.jpg,.gif,.jpeg";
    let dictDefaultMessage = 'Arrastra aquí la imagen a subir o haz click para seleccionarla.';
    let mediatype = 'image';
    if (props.state.mediatype === 'audio') {
        iconFiletypes = ['.mp3'];
        acceptedFiles = ".mp3";
        dictDefaultMessage = 'Arrastra aquí el audio a subir o haz click para seleccionarlo.';
        mediatype = 'audio';
    }

    const componentConfig = {
        iconFiletypes: iconFiletypes,
        showFiletypeIcon: true,
        postUrl: '/uploads',
    };
    const djsConfig = {
        paramName: "uri",
        uploadMultiple: false,
        maxFiles: 1,
        acceptedFiles: acceptedFiles,
        dictDefaultMessage: dictDefaultMessage,
        autoProcessQueue: false,
        params: {
            mediatype: mediatype,
            name: props.state.media_name,
            description: props.state.media_description,
        }
    }
    const eventHandlers = {
        init: function (dz) {
            dz.on('uploadprogress', function (file, progress) {
                // console.log('progresss', progress);
            });
            myDropzone = dz;
        },
        addedfile: function (file) {
            if (myDropzone.files && myDropzone.files.length > 1) {
                myDropzone.removeFile(myDropzone.files[0]);
            }
        },
        complete: function (file) {
            return Promise.delay(2000).then(function () {
                myDropzone.removeFile(file);
            });
        }
    }

    // Callback de la creación de imágenes en el servidor
    uploadService.removeListener('created').on('created', function (file) {
        //Notificar al form que se ha subido la nueva imagen
        //y agregarla al estado del formulario
        props.addMedia({
            file: {
                id: file.id,
                mediatype: mediatype,
                name: file.name,
                description: file.description
            }
        });
    });

    //ver si existe en el array de errores el error q corresponde a este campo
    if (R.find(R.propEq('type', 'upload_name_missing'))(props.state.error_messages) && error_message) {
        message = (<Message warning>
            <Message.Header>{error_message.header}</Message.Header>
            <p>{error_message.text}</p>
        </Message>);
    }

    return (
        <Segment attached>
          {message}
          <Form onSubmit={handleSubmit}>
              <Message><p><b>Medio actual: </b>{getMediaName(props)}</p></Message>
              <SimpleInputText key={'media_name'} {...props}
                  name={'media_name'}
                  title='Nombre'
                  field={['media_name']} />
              <SimpleTextArea key={'media_description'} {...props}
                  name={'media_description'}
                  title='Descripción'
                  field={['media_description']} />
              <DropzoneComponent config={componentConfig}
                  eventHandlers={eventHandlers}
                  djsConfig={djsConfig} />
              <Button content='Guardar' primary />
              <Button content='Cancelar' secondary onClick={closeModal} />
          </Form>
        </Segment>
    )
}

export default MediaUpload;
