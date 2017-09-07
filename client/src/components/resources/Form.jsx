import React, { Component } from 'react';
import { Form, Button, Menu, Segment } from 'semantic-ui-react';

import SimpleInputText from '../commons/activities/forms/inputs/TextSimple.jsx';
import SimpleInputHidden from '../commons/activities/forms/inputs/HiddenSimple.jsx';
import CheckboxLabeled from '../commons/activities/forms/inputs/CheckboxLabeled.jsx';
import DropdownSelection from '../commons/activities/forms/inputs/DropDown.jsx';
import SimpleTextArea from '../commons/activities/forms/inputs/TextAreaSimple.jsx';
import DropzoneComponent from 'react-dropzone-component';
import client from '../../modules/common/client.js'
import R from 'ramda';
import Promise from 'bluebird';

let myDropzone = null;
let myProps = null;
let error_message = null;
let message = '';


class ResourceForm extends Component {
  constructor(props) {
    super(props);
    this.state = props.model;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(lens, value) {
    this.setState((state) => {
      return R.set(R.lensPath(lens), value, state);
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    let metadadata = R.clone(this.state.selected_record);
    if (this.props.model.state === 'create') {
      if( this.isUploadResource(this.state.selected_record.resource_type) ) {
        myDropzone.processQueue();
      } else {
        //Realizar el create de los tipos no upload!
        this.props.controller.doCreate(metadadata);
      }
    }

    if (this.props.model.state === 'delete') {
      this.props.controller.doDelete(this.state.selected_record);
    }

    if (this.props.model.state === 'update') {
      this.props.controller.doUpdate(this.state.selected_record);
    }
  }

  handleCancel(event) {
    this.props.controller.handleCancel(this.state);
    event.preventDefault();
  }

  /*
  RESOURCES TYPES
    key: '0',
    value: 0,
    text: 'Actividad interactiva'

    key: '1',
    value: 1,
    text: 'Audio'

    key: '2',
    value: 2,
    text: 'Vídeo: YouTube'

    key: '3',
    value: 3,
    text: 'Vídeo: Vimeo'

    key: '4',
    value: 4,
    text: 'Presentación HTML'

    key: '5',
    value: 5,
    text: 'Galería de imágenes'
  */

  isUploadResource(t) {
    const tipo = parseInt(t, 10);
    return tipo === 0 || tipo === 1 || tipo === 4 || tipo === 5;
  }

  getDropZoneConfig(t) {
    const tipo = parseInt(t, 10);
    if(!tipo && tipo !== 0){
      return {};
    }
    let iconFiletypes = ['.zip'];

    return {
      iconFiletypes: iconFiletypes,
      showFiletypeIcon: true,
      postUrl: '/resources',
    };
  }

  getDJSConfig(config) {

    let options = config || {};
    let acceptedFiles = ".zip";
    let dictDefaultMessage = 'Arrastra aquí el fichero comprimido a subir o haz click para seleccionarlo.';
    let mediatype = 'zip';

    return {
      paramName: "uri",
      uploadMultiple: false,
      maxFiles: 1,
      acceptedFiles: acceptedFiles,
      dictDefaultMessage: dictDefaultMessage,
      autoProcessQueue: false,
      params: {
        mediatype: mediatype,
        name: this.state.selected_record.name,
        description: this.state.selected_record.description,
        level: this.state.selected_record.level,
        resource_type: this.state.selected_record.resource_type,
        published: this.state.selected_record.published,
        competence: this.state.selected_record.competence,
        cognitive_process: this.state.selected_record.cognitive_process,
        capacity: this.state.selected_record.capacity,
      }
    }
  }

  render() {
    let self = this;
    let fields = '';
    let form_view = '';
    let dropZ = '';
    let id_url_field = '';

    if (this.props.model.state === 'delete') {
      let frase = '¿Está seguro de borrar el recurso?';
      fields = <p>{frase}</p>
      form_view = <Segment attached><Form onSubmit={this.handleSubmit}>
        {fields}
        <Button content='Borrar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
      </Form></Segment>
    } else {
      const p = {
        props: this.props,
        change: this.handleChange,
        state: this.state
      };
      const config = this.state.config;
      // Panel de metadata de la actividad
      const level_options = config.combo_values.level;
      const resource_type_options = config.combo_values.resource_type;
      const competence_options = config.combo_values.competence;
      const cognitive_process_options = config.combo_values.cognitive_process;
      const capacity_options = config.combo_values.capacity;
      const metadata_panel = (<div>
        <SimpleInputText key={'name'} {...p} name={'activity_name'} title='Nombre del recurso' field={['selected_record', 'name']} />
        <Form.Group>
          <DropdownSelection {...p} name={'level'} title='Nivel del recurso' field={['selected_record', 'level']} options={level_options} />
        </Form.Group>
        <Form.Group>
          <DropdownSelection {...p} name={'resource_type'} title='Tipo de recurso' field={['selected_record', 'resource_type']} options={resource_type_options} />
        </Form.Group>
        <SimpleTextArea {...p} name={'description'} title='Descripción' field={['selected_record', 'description']} />
        <CheckboxLabeled {...p} name={'published'} title='Publicado:' field={['selected_record', 'published']} />
        <Form.Group widths='equal'>
          <DropdownSelection {...p} name={'competence'} title='Competencia' field={['selected_record', 'competence']} options={competence_options} />
          <DropdownSelection {...p} name={'cognitive_process'} title='Proceso cognitivo' field={['selected_record', 'cognitive_process']} options={cognitive_process_options} />
          <DropdownSelection {...p} name={'capacity'} title='Capacidad' field={['selected_record', 'capacity']} options={capacity_options} />
        </Form.Group>
      </div>);

      if (this.props.model.state === 'create' && this.isUploadResource(this.state.selected_record.resource_type)) {
        const componentConfig = this.getDropZoneConfig(this.state.selected_record.resource_type);
        const djsConfig = this.getDJSConfig(componentConfig);
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
        const upload_service = client.service('/resources')
        // Callback de la creación de imágenes en el servidor
        upload_service.removeListener('created').on('created', function (file) {
          //Notificar que se ha subido el nuevo recurso
          self.setState((state) => {
            return R.set(R.lensProp('loading'), true, state);
          });
          // TODO: recibir notificación de la descompresión!!!!!!!
          return Promise.delay(2000).then(function () {
            self.props.controller.resourceUploaded();
          });
        });

        dropZ = <DropzoneComponent config={componentConfig}
          eventHandlers={eventHandlers}
          djsConfig={djsConfig} />
      } else {
        id_url_field = <SimpleInputText key={'url'} {...p} name={'url'} title='Id del recurso' field={['selected_record', 'url']} />
      }



      form_view = <Segment attached><Form onSubmit={this.handleSubmit} loading={this.state.loading}>
        {metadata_panel}
        {dropZ}
        {id_url_field}
        <Button content='Guardar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
      </Form></Segment>

    }

    return (
      <div>
        {form_view}
      </div>
    )


  }
}

export default ResourceForm
