import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
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
    this.state = props.model.selected_record;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, result) {
    let pr = event.target.name;
    let val = event.target.value
    if(!pr && !val && result){ //Special fields: radiogroup, dropdown...
      pr = result.name;
      val = result.value
    }
    if(result.type === "checkbox"){
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

  render() {
    let self = this;
    let config = this.props.model.config;
    let fields = '';
    let frase = '';
    if(this.props.model.state === 'delete'){
      frase = '¿Está seguro de borrar al usuario: ' + this.props.model.selected_record.name + " " + this.props.model.selected_record.surname + "?"
      fields = <p>{frase}</p>
    } else {
      fields = _.map(this.state, function (value, key, state) {
        let p = {
          campo: key,
          props: self.props,
          change: self.handleChange,
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
            return <SimpleUpload key={key} {...p} />
            break
          case "date":
            return <SimpleInputText key={key} {...p} />
            break
          default:
            return <SimpleInputText key={key} {...p} />
            break;
        }
      });
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="dropzone">
            {fields}
            <Form.Button content='Enviar' />
        </Form>
      </div>
    )
  }
}

export default FormGroup
