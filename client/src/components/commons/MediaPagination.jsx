import React from 'react';
import { Icon, Segment, Button, Menu, Table, Message } from 'semantic-ui-react';
import R from 'ramda'


const clicked = (index, props) => {
  let page = index;
  const total = props.props.model.media_filter_pagination.total;
  const skip = props.props.model.media_filter_pagination.skip;
  const limit = props.props.model.media_filter_pagination.limit;
  const num_pages = total / limit;
  const current_page = Math.ceil(skip / limit) + 1;
  if(index === 'ell'){
    return;
  }
  if(index === 'prv'){
    page = current_page - 1;
    if(page < 1){
      return;
    }
  }
  if(index === 'nxt'){
    page = current_page + 1;
    if (page > num_pages) {
      return;
    }
  }
  // Si estamos pidiendo la página en la que estamos No hacemos nada
  if(page === current_page){
    return;
  }
  const next_skip = (page - 1) * limit;
  // Llamar a la nueva página
  props.props.controller.setMediaFilterPage(next_skip);
  props.filterMedia();
};

const MediaPagination = (props) => {
  /*
  media_filter_pagination: {
    skip: 0,
    total: 0,
    limit: 15,
  },
  */
  const total = props.props.model.media_filter_pagination.total;
  const skip = props.props.model.media_filter_pagination.skip;
  const limit = props.props.model.media_filter_pagination.limit;

  var num_pages = total / limit;
  var current_page = Math.ceil(skip / limit) + 1;
  var message = "";
  var liElements = [];
  var start = skip + 1;

    if (num_pages > 1){

      var style = '';
      if(current_page === 1){
          style = 'disabled';
      }
      liElements.push(
        <Menu.Item as='a' icon
          key='prev'
          id='prev'
          onClick={clicked.bind(this, 'prv', props)}>
         <Icon name='left chevron' />
        </Menu.Item>);

      for (var i = 1; i <= num_pages; i++) {
        var style = false;
        if(current_page === i){
            style = true;
        }
        liElements.push(
          <Menu.Item as='a'
            key={i}
            id={i}
            active= {style}
            onClick={clicked.bind(this, i, props)}>
            {i}
          </Menu.Item>);
      }

      if (num_pages > 1) {
        var style = '';
        if(current_page === num_pages){
            style = 'disabled';
        }
        <Menu.Item as='a' icon>
          <Icon name='right chevron' />
        </Menu.Item>
        liElements.push(
          <Menu.Item as='a' icon
            key='sig'
            id='sig'
            onClick={clicked.bind(this, 'nxt', props)}>
           <Icon name='right chevron' />
          </Menu.Item>);
      }
      //El máximo de botones a mostrar es de 10 TODO
      /*
      if(liElements.length > 10){
        liElements.splice(5, liElements.length-5, <li className="paginate_button" className="disabled" key="elipsis" id="elipsis"><a href="#" aria-controls="datatable_fixed_column" data-dt-idx="ellipsis" tabIndex="0" onClick={this.clicked.bind(this, "ell")}>&hellip;</a></li>);
      }
      */
      message = (<Message>
        <p>{"Mostrando:" + (start) + " a " + (skip + limit) + " de " + total}</p>
      </Message>);
      return (
        <Table.Row>
          <Table.HeaderCell colSpan='2'>
            {message}
          </Table.HeaderCell>
          <Table.HeaderCell colSpan='3'>
            <Menu floated='right' pagination>
              {liElements}
            </Menu>
          </Table.HeaderCell>
        </Table.Row>);
    } else {
      // Return nothing
      message = (<Message>
        <p>{"Mostrando:" + (start) + " a " + total + " de " + total}</p>
      </Message>);
      if(!total){
        message = "";
      }

      return (
        <Table.Row>
          <Table.HeaderCell colSpan='5'>
            {message}
          </Table.HeaderCell>
        </Table.Row>);
    }
};

export default MediaPagination;
