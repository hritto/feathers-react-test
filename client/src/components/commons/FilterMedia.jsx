import React from 'react'
import { Button, Header, Image, Menu, Item, Segment, Divider, Icon, Form, Message } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import SimpleInputText from './activities/forms/inputs/TextSimple.jsx';
import TableMediaFilter from './TableMedia.jsx';
import R from 'ramda';

const closeModal = (props) => {
    props.media({
        addMedia: null,
        media_lens: [],
        media_name: '',
        media_description: '',
        error_messages: [],
        media_filter: {}
    });
    props.props.controller.setMediaFilterRecords([]);
    props.props.controller.setMediaFilterPage(0);
};

const getMediaName = (props) => {
  return props.state.media_name || 'Ninguno...';
};

const FilterMedia = (props) => {
    return (
        <Segment attached>
          <Form>
            <Header as='h2'>
             <Icon name='film' />
             <Header.Content>
               Filtrar
             </Header.Content>
            </Header>
            <Message><p><b>Medio actual: </b>{getMediaName(props)}</p></Message>
            <SimpleInputText
              key={'by_name'} {...props}
              name={'filter_by_name'}
              title='Filtrar por nombre'
              field={['media_filter', 'name']}/>
            <SimpleInputText
              key={'by_original_name'} {...props}
              name={'filter_by_original_name'}
              title='Filtrar por nombre original'
              field={['media_filter', 'original_name']}/>
            <SimpleInputText
              key={'by_description'} {...props}
              name={'filter_by_description'}
              title='Filtrar por descripción'
              field={['media_filter', 'description']}/>
            <Button type='button' content='Filtrar' primary onClick={props.filterMedia.bind(this, 'filter')} />
            <Button type='button' content='Cancelar' secondary onClick={closeModal.bind(this, props)} />
            <TableMediaFilter {...props} />
          </Form>
        </Segment>
    )
};
export default FilterMedia
