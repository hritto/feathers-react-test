import React from 'react'
import { Icon, Label, Menu, Table, Image, Header, Button, Message } from 'semantic-ui-react'
import MediaPagination from './MediaPagination.jsx';

// import Helpers from '../helpers.js';
import R from 'ramda';

const _renderHeader = (record, props) => {
  let column_names = ['Imagen','Nombre', 'Nombre original', 'Descripción', ''];
  let columns = ['url', 'name', 'original_name', 'description', 'buttons'];
  let header = R.map((column) => {
      let title = column_names[columns.indexOf(column)];
      return <Table.HeaderCell key={'th_'+column}>{title}</Table.HeaderCell>;
    }, columns);
    return (
      <Table.Header>
        <Table.Row key='theader_row'>{header}</Table.Row>
      </Table.Header>
    )
};

const _row = (record, props) => {
  let columns = ['url','name', 'original_name', 'description'];
  let content = '',
  row_id = '',
  collapsing = false,
  cells = R.map((column) => {
    if(column === 'url'){
      content = <Image size='tiny' src={record[column]} />
    } else {
      content = record[column];
    }

    row_id = 'cell-' + column + record['_id'];

    return <Table.Cell key={row_id}>{content}</Table.Cell>;
  }, columns);

  // Ver si lleva botones
  let opts = {
    id: record['_id'],
    url_name: getFileName(record['url']),
    mediatype: props.state.mediatype
  }
  cells.push(<Table.Cell collapsing key={'buttons_'+record._id}>
    <Button type='button' key={'btn_'+record['_id']} icon='check' size='tiny' onClick={props.addElementMedia.bind(this, opts)} />
  </Table.Cell>)

  return <Table.Row key={'row_'+record._id}>{cells}</Table.Row>
};

const getFileName = (url) => {
  if(url && url.length){
    let begin = url.lastIndexOf("/") || 0;
    if(begin >= 0){
      return url.substring(begin + 1);
    }
    return url;
  }
};

const _renderBody = (records, props) => {
  const rows = R.map((record) => _row(record, props), records);
  return (
    <tbody>
      {rows}
    </tbody>
  )
};

const _renderFooter = (props) => {
  return (
    <Table.Footer fullWidth>
        <MediaPagination {...props} />
     </Table.Footer>
  )
};


const TableMediaFilter = (props) => {
  const records = props.props.model.media_filter_records || [];
  let no_data = '';

  if(records.length){
    let head = _renderHeader(records, props);
    let body = _renderBody(records, props);
    let foot = _renderFooter(props);
    return (
      <div id={"table_"+props.title}>
        <Table celled selectable>
          {head}
          {body}
          {foot}
        </Table>
      </div>
    );
  } else {
    // Si no hay datos
    return (<Message>
              <p>No hay datos para mostrar...</p>
            </Message>);
  }
};

export default TableMediaFilter;
