import React, { Component } from 'react';
import { Form, Button, Menu, Segment } from 'semantic-ui-react';
import SimpleInputText from './inputs/TextSimple.jsx';
import SimpleInputPassword from './inputs/PasswordSimple.jsx';
import SimpleInputHidden from './inputs/HiddenSimple.jsx';
import CheckboxSimple from './inputs/CheckboxSimple.jsx';
import DropdownSelection from './inputs/DropDown.jsx';
import SimpleTextArea from './inputs/TextAreaSimple.jsx';
import AvatarSelector from '../AvatarSelector.jsx';
import SimpleAvatar from './inputs/SimpleAvatar.jsx';
import DropzoneComponent from 'react-dropzone-component';
import R from 'ramda';
import Helpers from '../helpers.js';
import Promise from 'bluebird';


class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = R.merge(props.model.selected_record, {active_tab: 'datos'});
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.tabCanged = this.tabCanged.bind(this);
    this.avatarSelected = this.avatarSelected.bind(this);
    this.myDropzone = null;
    //this.uploadedFile = this.uploadedFile.bind(this);

  }

  avatarSelected(opts) {
    this.setState({photo: opts.url});
  }

  handleChange(event, result) {
    let pr = event.target.name;
    let val = event.target.value
    if(!pr && !val && result){ //Special fields: radiogroup, dropdown...
      pr = result.name;
      val = result.value
    }
    //Caso especial para checkboxes
    if(result && result.type === "checkbox"){
      pr = result.name;
      val = result.checked ? 1 : 0;
    }
    this.setState((state) => {
      const lens = R.lensProp(pr);
      return R.set(lens, val, state)
    });
  }

  handleSubmit(event) {
    this.props.controller.handleSubmit(this.state);
    event.preventDefault();
  }

  componentDidMount() {
    let self = this;
    const socket = io('http://localhost:3030');
    const app = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(socket));
    const uploadService = app.service('uploads');

    // Callback de la creación de imágenes en el servidor
    uploadService.on('created', function(file){
        //Cambiar la foto del usuario por la recién creada
        self.setState({photo: file.id})
        //Agregar la nueva imagen a la lista (local/temporal)
        self.props.controller.addNewAvatar({
          "url":Helpers.imageParser(file.id),
          "original_name":"unknown.png",
          "mediatype":"avatar",
          "_id":_.uniqueId('temp')
        });
    });
  }

  handleCancel(event) {
    this.props.controller.handleCancel(this.state);
    event.preventDefault();
  }

  tabCanged(event, { name }) {
    event.preventDefault();
    this.setState({ active_tab: name })
  }

  render() {
    let self = this;
    let config = this.props.model.config;
    let fields = '';
    let frase = '';
    let photo = '';
    let form_view = '';

    if(this.props.model.state === 'delete'){
      frase = '¿Está seguro de borrar al usuario: ' + this.props.model.selected_record.name + " " + this.props.model.selected_record.surname + "?"
      fields = <p>{frase}</p>
      form_view = <Segment attached><Form onSubmit={this.handleSubmit}>
          {fields}
          <Button content='Enviar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
      </Form></Segment>
    } else {
      if(this.state.active_tab === 'datos'){
        fields = _.map(this.state, function (value, key, state) {
          let el_config = R.find(R.propEq('name', key))(config.fields) || {};
          let p = {
            campo: key,
            props: self.props,
            change: self.handleChange,
            state: state,
            field_state: el_config.state
          };
          switch (el_config.type) {
            case "hidden":
              return <SimpleInputHidden key={key} {...p} />
              break;
            case "text":
              return <SimpleInputText key={key} {...p} />
              break;
            case "combo":
              return <DropdownSelection key={key} {...p} />
              break;
            case "textarea":
              return <SimpleTextArea key={key} {...p} />
              break;
            case "password":
              return <SimpleInputPassword key={key} {...p} />
              break;
            case "boolean":
              return <CheckboxSimple key={key} {...p} />
              break;
            case "image":
              return <SimpleAvatar key={key} {...p} />;
              break
            case "date":
              return <SimpleInputText key={key} {...p} />
              break
            default:
              return ''; //No es un campo del formulario
              break;
          }
        });
        form_view = <Segment attached><Form onSubmit={this.handleSubmit}>
            {fields}
            <Button content='Guardar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
        </Form></Segment>
      }

      if(this.state.active_tab === 'fotos'){
        let self = this;
        let myDropzone = null;
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/uploads',

        };
        const djsConfig = {
          paramName: "uri",
          uploadMultiple: false,
          acceptedFiles: ".png,.jpg,.gif,.jpeg",
          dictDefaultMessage: 'O arrastra aquí la foto que deseas usar...',
          params: {
              user_id: self.state._id,
              mediatype: 'avatar'
          }
        }
        const eventHandlers = {
          init: function(dz){
              dz.on('uploadprogress', function(file, progress){
                  console.log('progresss', progress);
              });
              self.myDropzone = dz;
          },
          complete: function(file) {
            return Promise.delay(2000).then(function(){
              self.myDropzone.removeFile(file);
            });
          }
        }
        form_view = (
          <Segment attached>
            <AvatarSelector {...this.props} avatarSelected={this.avatarSelected} sel={this.state.photo} />
            <Segment>
              <DropzoneComponent config={componentConfig}
                                 eventHandlers={eventHandlers}
                                 djsConfig={djsConfig} />
            </Segment>
          </Segment>
        );
      }
    }

    if(this.props.model.state === 'delete'){
      return (
        <div>
          {form_view}
        </div>
      )
    } else {
      return (
        <div>
          <Menu tabular attached>
            <Menu.Item name='datos' active={this.state.active_tab === 'datos'} onClick={this.tabCanged}>Datos de la Cuenta</Menu.Item>
            <Menu.Item name='fotos' active={this.state.active_tab === 'fotos'} onClick={this.tabCanged}>Avatar</Menu.Item>
          </Menu>
          {form_view}
        </div>
      )
    }


  }
}

export default FormGroup
