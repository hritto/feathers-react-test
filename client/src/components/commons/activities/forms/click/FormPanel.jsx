
import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu } from 'semantic-ui-react';
import SimpleInputText from '../inputs/TextSimple.jsx';
import SimpleInputPassword from '../inputs/PasswordSimple.jsx';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import CheckboxSimple from '../inputs/CheckboxSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import R from 'ramda';

const FormPanel = (props) => {
  return {
    title: 'Escena ' + props.index + " - " + props.code.instruction.text,
    content: formClickTemplate(props)
  }
};

const formClickTemplate = (props) => {
  // Agregar las props específicas
  props['field_map'] = ['code', props.index, 'instruction', 'text'];
  props['field'] = 'instruction';
  return (
    // Título / Instruccion
    <SimpleInputText key={'instruction_' + props.index} {...props} />
  );
};

export default FormPanel;

