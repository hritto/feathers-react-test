import React from 'react'
import { Button, Header, Image, Menu, Item, Segment } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import SimpleInputText from './activities/forms/inputs/TextSimple.jsx';
import TableLayout from './grid_manager/Table.jsx';
import R from 'ramda';

let main_props = null;
const doFilter = () => {
  let records = main_props.props.controller.getMediaFilterRecords({
    original_name: 'RO',
    name: 'ef',
  }, 'image');
};

const closeModal = () => {
    main_props.media({
        addMedia: null,
        media_lens: [],
        media_name: '',
        media_description: '',
        error_messages: []
    });
};

const FilterMedia = (props) => {
  // "original_name":"roto_txt.png","mediatype":"image","name":"wefq","description":"erg"
    main_props = props;
    let table = ''
    if(props.props.model.media_filter_records && props.props.model.media_filter_records.length){
      //Pintar la tabla
      table = <TableLayout {...props} />
    }

    return (
        <Segment attached>
          Filtrar:
          <SimpleInputText
            key={'by_name'} {...props}
            name={'filter_by_name'}
            title='Filtrar por nombre'
            field={['media_filter', 'name']}/>
          <SimpleInputText
            key={'by_original_name'} {...props}
            name={'filter_by_original_name'}
            title='Filtrar por nombre original del fichero'
            field={['media_filter', 'original_name']}/>
          <SimpleInputText
            key={'by_description'} {...props}
            name={'filter_by_description'}
            title='Filtrar por descripción'
            field={['media_filter', 'description']}/>
          <Button content='Filtrar' primary onClick={doFilter} />
          {table}
          <Button content='Guardar' primary />
          <Button content='Cancelar' secondary onClick={closeModal} />
        </Segment>
    )
};
export default FilterMedia
