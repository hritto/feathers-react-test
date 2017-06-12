import React, { Component } from 'react'
import { Form, Button, Menu, Segment } from 'semantic-ui-react'
//import InputText from './inputs/TextComponent.jsx'
import SimpleInputText from './inputs/TextSimple.jsx'
import SimpleInputPassword from './inputs/PasswordSimple.jsx'
import SimpleInputHidden from './inputs/HiddenSimple.jsx'
import CheckboxSimple from './inputs/CheckboxSimple.jsx'
import DropdownSelection from './inputs/DropDown.jsx'
import SimpleTextArea from './inputs/TextAreaSimple.jsx'
import SimpleUpload from './inputs/UploadSimple.jsx'

import R from 'ramda'

class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = R.merge(props.model.selected_record, {active: 'datos'});
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePhotoSubmit = this.handlePhotoSubmit.bind(this);

    this.handleCancel = this.handleCancel.bind(this);
    this.tabCanged = this.tabCanged.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
    this.myDropzone = null;
  }

  changePhoto(st) {
    this.setState((state) => {
      const lens = R.lensProp(st.field);
      return R.set(lens, st.value, state)
    });
  }

  handleChange(event, result) {
    let pr = event.target.name;
    let val = event.target.value
    if(!pr && !val && result){ //Special fields: radiogroup, dropdown...
      pr = result.name;
      val = result.value
    }
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

  handlePhotoSubmit(event) {
    //this.props.controller.handlePhotoSubmit(this.state);
    event.preventDefault();
    var socket = io('http://localhost:3030');
    const appU = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(socket));
    const uploadService = appU.service('uploads');

    // Now with Real-Time Support!
    uploadService.on('created', function(file){
        alert('Received file created event!', file);
    });

    Dropzone.options.myAwesomeDropzone = {
                paramName: "uri",
                uploadMultiple: false,
                init: function(){
                  debugger;
                    this.on('uploadprogress', function(file, progress){
                        console.log('progresss', progress);
                    });
                }
            };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

    if(this.state.active ==='fotos'){
      let self = this;
      const socket = io('http://localhost:3030');
      const app = feathers()
      .configure(feathers.hooks())
      .configure(feathers.socketio(socket));
      const uploadService = app.service('uploads');

      // Now with Real-Time Support!
      uploadService.on('created', function(file){
          alert('Received file created event!', file);
      });

      $("div#my-awsome-dropzone").dropzone({
        url: "/uploads",
        paramName: "uri",
        uploadMultiple: false,
        params: {
          user_id: self.state._id
        },
        init: function(){
            this.on('uploadprogress', function(file, progress){
                console.log('progresss', progress);
            });
        }
      });
    }

  }

  handleCancel(event) {
    this.props.controller.handleCancel(this.state);
    event.preventDefault();
  }

  tabCanged(event, { name }) {
    event.preventDefault();
    this.setState({ active: name })
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
    } else {
      if(this.state.active === 'datos'){
        fields = _.map(this.state, function (value, key, state) {
          let p = {
            campo: key,
            props: self.props,
            change: self.handleChange,
            changePhoto: self.changePhoto,
            state: state
          };
          let el_config = R.find(R.propEq('name', key))(config.fields);
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
              return ''; //<SimpleUpload key={key} {...p} />;
              break
            case "date":
              return <SimpleInputText key={key} {...p} />
              break
            default:
              return <SimpleInputText key={key} {...p} />
              break;
          }
        });
        form_view = <Segment attached><Form onSubmit={this.handleSubmit}>
            {fields}
            <Button content='Enviar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
        </Form></Segment>
      }

      if(this.state.active === 'fotos'){
        /*
        form_view = <Segment attached><Form onSubmit={this.handlePhotoSubmit}>

            <Button content='Enviar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
        </Form></Segment>
        */
        form_view = <Segment attached>
          <div id='my-awsome-dropzone' style={{width:'100%', height:'200px'}}></div>
        </Segment>
      }


    }
    return (
      <div>
        <Menu tabular attached>
          <Menu.Item name='datos' active={this.state.active === 'datos'} onClick={this.tabCanged}>Datos de la Cuenta</Menu.Item>
          <Menu.Item name='fotos' active={this.state.active === 'fotos'} onClick={this.tabCanged}>Fotos</Menu.Item>
        </Menu>
        {form_view}
      </div>
    )
  }
}

export default FormGroup
