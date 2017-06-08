import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import InputText from './inputs/text.jsx'
import R from 'ramda'

class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = props.model.selected_record;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let pr = event.target.name;
    let val = event.target.value;
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
            return <InputText key={key} {...p} />
            break;
          case "text":
            return <InputText key={key} {...p} />
            break;
          case "combo":
            //combo_data = this.props.model.getComboData(key);
            return <InputText key={key} {...p} />
            break;
          case "textarea":
            return <InputText key={key} {...p} />
            break;
          case "password":
            return <InputText key={key} {...p} />
            break;
          case "boolean":
            return <InputText key={key} {...p} />
            break;
          case "image":
            return <InputText key={key} {...p} />
            break
          case "date":
            return <InputText key={key} {...p} />
            break
          default:
            return <InputText key={key} {...p} />
            break;
        }
      });
    }
    console.log("-----------------------")
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
            {fields}
            <Form.Button content='Enviar' />
        </Form>
      </div>
    )
  }
}

export default FormGroup
