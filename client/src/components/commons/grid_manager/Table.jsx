import React from 'react'
import { Icon, Label, Menu, Table, Image } from 'semantic-ui-react'
import ButtonIcon from '../ButtonIcon.jsx';
import Helpers from '../helpers.js';
import R from 'ramda';

const _renderHeader = (record, config) => {
  let columns = R.keys(record[0]),
    display = '',
    width = '',
    column_name = '',
    conf = null,
    header = R.map((column) => {
      display = '';
      conf = R.find(R.propEq('name', column))(config) || {};
      //Si tiene un nombre que no es el nombre por defecto
      column_name = conf.name;

      if(!conf.visibility){
        display = 'none';
      }
      width = conf.flex + '%';
      return <th style={{display: display, width: width}} key={'th_'+column_name}>{column_name}</th>;
    }, columns);
    return (
      <Table.Header>
        <tr key='theader_row'>{header}</tr>
      </Table.Header>
    )
};


const _row = (record, config) => {
  let columns = R.keys(record),
    style = '',
    display = '',
    width = '',
    content = '',
    text = '',
    col_type = '',
    row_id = '',
    conf = null,
    cells = R.map((column) => {
      debugger;
      conf = R.find(R.propEq('name', column))(config) || {};
      col_type = conf.type;
      text = record[column];
      // El renderer es una funciÃ³n para formatear los valores de los campos cuando es necesario
      content = text;
      if(!conf.visibility){
        display = 'none';
      }
      width = conf.flex + '%';
      row_id = 'cell-' + conf['name'] + record['_id'];

      return <td style={{display: display, width: width}} key={row_id}>{content}</td>;
    }, columns);

  return <tr key={'row_'+record._id}>{cells}</tr>
};

const _renderBody = (records, config) => {
  const rows = R.map((record) => _row(record, config), records);
  return (
    <tbody>
      {rows}
    </tbody>
  )
};


const TableLayout = (props) => {
  const records = props.model.records || [];
  let no_data = '';
  //let columns = R.keys(records[0]);
  let config = props.model.config;

  if(records.length){
    let head = _renderHeader(records, config.fields);
    let body = _renderBody(records, config.fields);
    return (
      <div id={"table_"+props.title}>
        <Table celled>
          {head}
          {body}
        </Table>
      </div>
    );
  } else {
    // Si no hay datos
    return <p className="no_data">No hay datos para mostrar...</p>
  }
};

export default TableLayout
