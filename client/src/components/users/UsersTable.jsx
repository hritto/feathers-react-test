import React from 'react'
import { Icon, Label, Menu, Table, Image, Header } from 'semantic-ui-react'
import ButtonIcon from '../commons/ButtonIcon.jsx';
import Helpers from '../commons/helpers.js';
import R from 'ramda';

const _renderHeader = (record, config, props) => {
  let columns = R.keys(record[0]),
    display = '',
    width = '',
    conf = null,
    header = R.map((column) => {
      display = '';
      conf = R.find(R.propEq('name', column))(config) || {};
      
      if(!conf.visibility){
        display = 'none';
      }
      width = conf.flex + '%';

      return <Table.HeaderCell style={{display: display, width: width}} key={'th_'+conf.label}>{conf.label}</Table.HeaderCell>;
    }, columns);
    // El extra para los botones
    header.push(<Table.HeaderCell style={{width: '1%'}} key={'th_btns'}></Table.HeaderCell>)
    return (
      <Table.Header>
        <Table.Row key='theader_row'>{header}</Table.Row>
      </Table.Header>
    )
};

const getCellContent = (config, content) => {
  switch (config.type) {
    case 'boolean':
        if (content) {
           return <Icon name='check' color='green' size='small' />
        }
        return <Icon name='remove' color='red' size='small' />
    case 'image':
        return <Image avatar src={Helpers.imageParser(Helpers.imageParser(content))} />
    default:
        return content;
  }
};

const _row = (record, config, props) => {
  let columns = R.keys(record),
    style = '',
    display = '',
    width = '',
    content = '',
    row_id = '',
    conf = null,
    cells = R.map((column) => {
      display = '';
      conf = R.find(R.propEq('name', column))(config) || {};
      if (conf.type !== 'hidden') {
        // El renderer es una función para formatear los valores de los campos cuando es necesario
        content = getCellContent(conf, record[column]);
      }
      
      if(!conf.visibility){
        display = 'none';
      }
      if(conf.name === 'gender') {
        if(record[column] === 'male') {
          content =  (<Icon name='male' size='large' />);
        } else {
          content = (<Icon name='female' size='large' />);
        }
      }

      if (conf.renderer && typeof conf.renderer === 'function') {
        content = conf.renderer(record[column]);
      }

      // Celda especial
      if(conf.name === 'name') {
        content = (
        <Header as='h4' image>
          <Image avatar src={Helpers.imageParser(Helpers.imageParser(record.photo))} />
          <Header.Content>
            {record.surname}
            <Header.Subheader>{record.name}</Header.Subheader>
          </Header.Content>
        </Header>
        )
      }      

      width = conf.flex + '%';
      row_id = 'cell-' + conf['name'] + record['_id'];

      return <Table.Cell style={{display: display, width: width}} key={row_id}>{content}</Table.Cell>;
    }, columns);

  // Botones 
  cells.push(<Table.Cell style={{width: '1%'}} key={'buttons_'+record._id}>
    <ButtonIcon props={props} record={record} id={'buttons_'+record._id} />
  </Table.Cell>)

  return <Table.Row key={'row_'+record._id}>{cells}</Table.Row>
};

const _renderBody = (records, config, props) => {
  const rows = R.map((record) => _row(record, config, props), records);
  return (
    <tbody>
      {rows}
    </tbody>
  )
};


const UserTable = (props) => {
  const records = props.model.records || [];
  let no_data = '';
  //let columns = R.keys(records[0]);
  let config = props.model.config;

  if(records.length){
    let head = _renderHeader(records, config.fields, props);
    let body = _renderBody(records, config.fields, props);
    return (
      <div id={"table_"+props.title}>
        <Table celled selectable>
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

export default UserTable
