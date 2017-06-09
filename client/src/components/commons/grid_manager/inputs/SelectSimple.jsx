import React from 'react'
import { Select } from 'semantic-ui-react'


const SelectSimple = (props) => {
  debugger;
    return (
    <Select placeholder='Seleccionar...'
            options={props.props.model.config.combo_values[props.campo]}
            onChange={props.change}
            name={props.campo}
            value={props.state[props.campo]} />)}

export default SelectSimple
