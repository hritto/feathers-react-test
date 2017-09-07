import React from 'react'
import { Icon, Label, Menu, Image, Header, Message, Accordion, Button, Item, Table } from 'semantic-ui-react'
import ButtonIcon from '../commons/ButtonIcon.jsx';
import Helpers from '../commons/helpers.js';
import R from 'ramda';


const showMessage = (props) => {
  if (!props.model.message){
    return '';
  }
  return (
  <Message>
    {props.model.message}
  </Message>
)};

let main_props = null;

const setActiveIndex = (e, i) => {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === "I") {
    return false;
  }
  let val = i;
  if (main_props.controller.getActiveIndex() === i) {
    val = null;
  }
  main_props.controller.setActiveIndex(val)
  window.dispatchEvent(new Event('resize'));
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

const _renderHeader = (record, opts, props) => {
  let columns = R.keys(record[0]),
    display = '',
    width = '',
    conf = null,
    config = opts.fields,
    header = R.map((column) => {
      display = '';
      conf = R.find(R.propEq('name', column))(config) || {};

      if(!conf.visibility){
        display = 'none';
      }
      width = conf.flex + '%';

      return <Table.HeaderCell style={{display: display, width: width}} key={'th_'+_.uniqueId('head')}>{conf.label}</Table.HeaderCell>;
    }, columns);
    // El extra para los botones
    header.push(<Table.HeaderCell style={{width: '1%'}} key={'th_btns'}></Table.HeaderCell>)
    return (
      <Table.Header>
        <Table.Row key='theader_row'>{header}</Table.Row>
      </Table.Header>
    )
};

const _panel = (record, opts, props, index) => {

  let columns = R.keys(record),
    config = opts.fields,
    style = '',
    display = '',
    width = '',
    content = '',
    row_id = '',
    conf = null,
    options = null;
  let cells = R.map((column) => {
    display = '';
    conf = R.find(R.propEq('name', column))(config) || {};
    if (column === 'items'){
      return;
    }
    if (conf.type !== 'hidden') {
      // El renderer es una función para formatear los valores de los campos cuando es necesario
      content = getCellContent(conf, record[column]);
    }

    if(!conf.visibility){
      display = 'none';
    }

    if (conf.renderer && typeof conf.renderer === 'function') {
      if(conf.type === 'combo' && conf.constructor){
          options = opts.combo_values[conf.constructor];
          content = conf.renderer(record[column], options);
      } else {
          content = conf.renderer(record[column]);
      }
    }
    return <Table.Cell style={{display: display, width: width}} key={conf.name+'_'+record._id}>{content}</Table.Cell>;
  }, columns);

  //Renderizar solo la escena abierta
  if (parseInt(props.model.active_index, 10) === index) {
    //La primera tabla es la información del Plan
    const btn_add = <Button type="button" className='accordion_btn' floated='right' key={'btn_add_plan_item' + index} icon='plus' color='blue' size='tiny' onClick={props.controller.itemClick.bind(this, {
      action: 'add_plan_item',
      id: record._id
    })} />;
    cells.push(<Table.Cell style={{width: '1%'}} key={'btns_'+index+ '_' +record._id}>{btn_add}</Table.Cell>)
    const records = props.model.records || [];
    const head = _renderHeader(records, props.model.config, props);
    const table = <Table celled attached='top'>
        {head}
        <tbody>
          <Table.Row key={'row_'+record._id}>{cells}</Table.Row>
        </tbody>
      </Table>

    //Los elementos del plan??

    return {
      key: `panel-${index}`,
      title: (<div style={{ display: 'inline' }} key={'container_' + index} >
        {record['name']}
      </div>),
      content: (
        <div>
          {table}
        </div>)
    }
  }
  return {
    key: `panel-${index}`,
    title: (<div style={{ display: 'inline' }} key={'container_' + index} >
      {record['name']}
      <Button type="button" className='accordion_btn' floated='right' key={'btn_delete' + index} icon='delete' color='red' size='tiny' onClick={props.controller.itemClick.bind(this, {
        action: 'delete',
        id: record._id
      })} />
      <Button type="button" className='accordion_btn' floated='right' key={'btn_update' + index} icon='edit' color='teal' size='tiny' onClick={props.controller.itemClick.bind(this, {
        action: 'update',
        id: record._id
      })} />
    </div>),
    content: ''
  }
};

const _renderBody = (records, opts, props) => {
  const mapIndexed = R.addIndex(R.map);
  const panels = mapIndexed((record, i) => _panel(record, opts, props, i), records);
  return (
    <Accordion panels={panels} className='accordion_table' styled fluid activeIndex={props.model.active_index} onTitleClick={setActiveIndex} />
  )
};


const ExpandableLayout = (props) => {
  const records = props.model.records || [];
  main_props = props;
  let no_data = '';
  let config = props.model.config;
  if(records.length){
    let body = _renderBody(records, config, props);
    let message = showMessage(props);
    return (
      <div id={"workplans_"+props.title}>
        {message}
        {body}
      </div>
    );
  } else {
    // Si no hay datos
    return <p className="no_data">No hay datos para mostrar...</p>
  }
};

export default ExpandableLayout
