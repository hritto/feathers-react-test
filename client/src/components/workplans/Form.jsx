import React, { Component } from 'react';
import { Form, Button, Menu, Segment } from 'semantic-ui-react';

import SimpleInputText from '../commons/activities/forms/inputs/TextSimple.jsx';
import SimpleInputHidden from '../commons/activities/forms/inputs/HiddenSimple.jsx';
import CheckboxLabeled from '../commons/activities/forms/inputs/CheckboxLabeled.jsx';
import DropdownSelection from '../commons/activities/forms/inputs/DropDown.jsx';
import SimpleTextArea from '../commons/activities/forms/inputs/TextAreaSimple.jsx';
import client from '../../modules/common/client.js'
import R from 'ramda';
import Promise from 'bluebird';


let myProps = null;
let error_message = null;
let message = '';


class WorkPlansForm extends Component {
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
      this.props.controller.doCreate(metadadata);
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

  render() {
    let self = this;
    let fields = '';
    let form_view = '';

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
      const competence_options = config.combo_values.competence;
      const cognitive_process_options = config.combo_values.cognitive_process;
      const capacity_options = config.combo_values.capacity;
      const metadata_panel = (<div>
        <SimpleInputText key={'name'} {...p} name={'activity_name'} title='Nombre del Plan' field={['selected_record', 'name']} />
        <Form.Group>
          <DropdownSelection {...p} name={'level'} title='Nivel del Plan' field={['selected_record', 'level']} options={level_options} />
        </Form.Group>
        <SimpleTextArea {...p} name={'description'} title='Descripción' field={['selected_record', 'description']} />
        <CheckboxLabeled {...p} name={'published'} title='Publicado:' field={['selected_record', 'published']} />
        <Form.Group widths='equal'>
          <DropdownSelection {...p} name={'competence'} title='Competencia' field={['selected_record', 'competence']} options={competence_options} />
          <DropdownSelection {...p} name={'cognitive_process'} title='Proceso cognitivo' field={['selected_record', 'cognitive_process']} options={cognitive_process_options} />
          <DropdownSelection {...p} name={'capacity'} title='Capacidad' field={['selected_record', 'capacity']} options={capacity_options} />
        </Form.Group>
      </div>);

      form_view = <Segment attached><Form onSubmit={this.handleSubmit} loading={this.state.loading}>
        {metadata_panel}
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

export default WorkPlansForm;
