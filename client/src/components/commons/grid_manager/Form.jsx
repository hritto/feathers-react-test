import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import R from 'ramda';

const FormGroup = (props) => {
  let record = {};
  if(props.model.state === 'update') {
    if(props.model.selected_record_id){
      record = R.find(R.propEq('_id', props.model.selected_record_id))(props.model.records);
    }
  }
  //state = { name: '', email: '', submittedName: '', submittedEmail: '' }

  //handleChange = (e, { name, value }) => this.setState({ [name]: value })
  /*
  handleSubmit = e => {
    e.preventDefault()
    const { name, email } = this.state

    this.setState({ submittedName: name, submittedEmail: email })
  }
  */

  //const { name, email, submittedName, submittedEmail } = this.state

  return (
    <div>
      <Form onSubmit={props.controller.handleSubmit.bind(this)}>
        <Form.Group>
          <Form.Input placeholder='Rol' name='rol' value={record.role} onChange={props.controller.handleChange.bind(this)} />
          <Form.Input placeholder='Email' name='email' value={record.email} onChange={props.controller.handleChange.bind(this)} />
          <Form.Button content='Enviar' />
        </Form.Group>
      </Form>
    </div>
  )
};

export default FormGroup
