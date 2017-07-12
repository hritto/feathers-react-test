import React, {Component} from 'react';
import {
  Container,
  Header,
  Icon,
  Segment,
  Divider,
  Accordion,
  Form,
  Button,
  Menu
} from 'semantic-ui-react';
import FormPanel from './FormPanel.jsx';
import RibbonHeader from '../../../header.jsx';
import MediaModalView from '../../../MediaModal.jsx'
import LayoutClickForm from './LayoutClick.jsx'
import LayoutHelpers from '../../../positioning_helper.js';
import SimpleInputText from '../inputs/TextSimple.jsx';
import DropdownSelection from '../inputs/DropDown.jsx';
import CheckboxLabeled from '../inputs/CheckboxLabeled.jsx';
import R from 'ramda';

class ClickForm extends Component {
  constructor(props) {
    super(props);
    this.state = R.merge(props.model.activity_code, {
      active_index: null,
      addMedia: null, // image, audio, text
      media_lens: [], // el lens al elemento que va a modificar sus medios
      media_name: '',
      media_description: '',
      error_messages: [], //Los errores de upload de medios
      active_metadata: null,
      metadata: props.model.selected_record,
      combo_values: props.model.config.combo_values,
      media_tab: 'table',
      media_filter_records: props.model.media_filter_records,
      media_filter: props.model.media_filter,
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleResolution = this.handleResolution.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDeleteElement = this.handleDeleteElement.bind(this);
    this.handleCreateElement = this.handleCreateElement.bind(this);
    this.myDropzone = null;
    this._getPanelContent = this._getPanelContent.bind(this);
    this._renderFieldsForm = this._renderFieldsForm.bind(this);
    this._renderLayoutForm = this._renderLayoutForm.bind(this);
    this._setActiveIndex = this._setActiveIndex.bind(this);
    this._setAddMedia = this._setAddMedia.bind(this);
    this._addMediaState = this._addMediaState.bind(this);
    this._setErrors = this._setErrors.bind(this);
    this._updateModel = this._updateModel.bind(this);
    this._calculateLayout = this._calculateLayout.bind(this);
    this.setActiveMetadata = this.setActiveMetadata.bind(this);
    this.setMediaTabs = this.setMediaTabs.bind(this);
  }

  _updateModel() {
    this.props.controller.updateActivityCode({code: this.state.code, media: this.state.media});
    this.props.controller.updateActivityMetadata({
      name: this.state.metadata.name,
      activity_type: this.state.metadata.activity_type,
      level: this.state.metadata.level,
      published: this.state.metadata.published,
      name: this.state.metadata.name,
      capacity: this.state.metadata.capacity,
      cognitive_process: this.state.metadata.cognitive_process,
      competence: this.state.metadata.competence
    });
  };

  _setErrors(opts) {
    let errors = [];
    if (R.type(opts) !== 'Array') {
      errors.push(opts);
    } else {
      errors = opts;
    }
    this.setState((state) => {
      const lens = R.lensProp('error_messages');
      return R.set(lens, errors, state);
    });
  };

  _setActiveIndex(e, i) {
    if (e.target.tagName === 'BUTTON') {
      return false;
    }
    let val = i;
    if (this.state.active_index === i) {
      val = null;
    }
    this.setState((state) => {
      return R.set(R.lensProp('active_index'), val, state);
    });
    window.dispatchEvent(new Event('resize'));
  };

  setActiveMetadata(active, e) {
    this.setState((state) => {
      return R.set(R.lensProp('active_metadata'), active === null
        ? 0
        : null, state);
    });
    window.dispatchEvent(new Event('resize'));
  };

  setMediaTabs(active, e) {
    this.setState((state) => {
      return R.set(R.lensProp('media_tab'), active, state);
    });
  };

  handleChange(lens, value) {
    this.setState((state) => {
      return R.set(R.lensPath(lens), value, state);
    }, function() {
      this._updateModel();
    });
  };

  handleResolution(name, value, index) {
    this.setState((state) => {
      return R.set(R.lensPath(['code', index, 'resolution', name]), value, state);
    }, function() {
      this._updateModel();
    });
  };

  _calculateLayout() {
    return new Promise(function(resolve, reject) {
      //LayoutHelpers
    }).then(function() {
      return resolve();
    });
  };

  handleDeleteElement(element_id, i) {
    this.setState((state) => {
      const st = R.clone(state);
      delete st.code[i].elements[element_id];
      return st;
    }, function() {
      // Recalcular el layour
      this._calculateLayout().then(function() {
        this._updateModel();
      });
    });
  };

  handleCreateElement(element, i, name) {
    this.setState((state) => {
      const st = R.clone(state);
      st.code[i].elements[name] = element;
      return st;
    }, function() {
      this._updateModel();
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    this._updateModel();
    this.props.controller.updateCode();
    return false;
  };

  handleCancel(event) {
    this.props.controller.handleCancel(this.state);
    event.preventDefault();
  };

  _getPanelContent(code, i) {
    let p = {
      props: this.props,
      change: this.handleChange,
      resolution: this.handleResolution,
      state: this.state,
      index: i,
      handleDeleteElement: this.handleDeleteElement,
      handleCreateElement: this.handleCreateElement,
      media: this._setAddMedia,
      activity_type: code.type,
      media_tab: this.setMediaTabs
    };
    return FormPanel(p);
  };

  //Abrir la modal de carga/selección de medios
  _getMediaForm() {
    let p = {
      props: this.props,
      state: this.state,
      media: this._setAddMedia,
      error: this._setErrors,
      addMedia: this._addMediaState,
      change: this.handleChange,
      media_tab: this.setMediaTabs
    };
    return <MediaModalView {...p}/>
  };

  _setAddMedia(opts) {
    this.setState((state) => {
      return {addMedia: opts.action, media_lens: opts.lens, media_name: opts.media_name, media_description: opts.media_description};
    });
  }

  _addMediaState(opts) {
    let lens = this.state.media_lens;
    let mediaLens = [];
    let val = opts.file.id;
    if (opts.file.mediatype === 'audio') {
      mediaLens = ['media', 'sounds', opts.file.id]; // = opts.file.id;
      opts.file.mediatype = 'sound'
      val = {
        mp3: opts.file.id
      };
    }
    if (opts.file.mediatype === 'image') {
      mediaLens = ['media', 'images', opts.file.id]; // = opts.file.id;
    }
    lens.push(opts.file.mediatype); // image, sound, text
    //Cambiar la imagen del elemento
    this.setState((state) => {
      const lensP = R.lensPath(lens);
      return R.set(lensP, opts.file.id, state);
    });
    //Añadir la imagen al hash de media
    this.setState((state) => {
      const lensMedia = R.lensPath(mediaLens);
      return R.set(lensMedia, val, state);
    });
    //Quitar el mensaje de error y resetear el estado del componente MediaUpload
    this.setState((state) => {
      return {addMedia: null, media_lens: [], media_name: '', media_description: '', error_messages: []};
    }, function() {
      this._updateModel();
    });
  }

  _renderFieldsForm() {
    const self = this;
    const mapIndexed = R.addIndex(R.map);
    let media_form = '';
    const panels = mapIndexed(function(code, i) {
      return self._getPanelContent(code, i);
    }, this.state.code);

    // Abrir la modal de carga/seleccion de medios
    if (this.state.addMedia) {
      media_form = this._getMediaForm();
    }

    const p = {
      props: this.props,
      change: this.handleChange,
      state: this.state
    };
    // Panel de metadata de la actividad
    const level_options = this.state.combo_values.level;
    const activity_type_options = this.state.combo_values.activity_type;
    const competence_options = this.state.combo_values.competence;
    const cognitive_process_options = this.state.combo_values.cognitive_process;
    const capacity_options = this.state.combo_values.capacity;
    const metadata_panel = [
      {
        key: 'metadata',
        title: 'Metadatos de la Actividad',
        content: (
          <div>
            <SimpleInputText key={'name'} {...p} name={'activity_name'} title='Nombre de la actividad' field={['metadata', 'name']}/>
            <Form.Group>
              <DropdownSelection {...p} name={'level'} title='Nivel de la actividad' field={['metadata', 'level']} options={level_options}/>
            </Form.Group>
            <Form.Group>
              <DropdownSelection {...p} name={'activity_type'} title='Tipo de actividad' field={['metadata', 'activity_type']} options={activity_type_options}/>
            </Form.Group>
            <CheckboxLabeled {...p} name={'published'} title='Publicada:' field={['metadata', 'published']}/>
            <Form.Group widths='equal'>
              <DropdownSelection {...p} name={'competence'} title='Competencia' field={['metadata', 'competence']} options={competence_options}/>
              <DropdownSelection {...p} name={'cognitive_process'} title='Proceso cognitivo' field={['metadata', 'cognitive_process']} options={cognitive_process_options}/>
              <DropdownSelection {...p} name={'capacity'} title='Capacidad' field={['metadata', 'capacity']} options={capacity_options}/>
            </Form.Group>
          </div>
        )
      }
    ];

    return (
      <Segment attached>
        <Form onSubmit={this.handleSubmit}>
          <Accordion panels={metadata_panel} styled fluid activeIndex={this.state.active_metadata} onTitleClick={this.setActiveMetadata.bind(this, this.state.active_metadata)}/>
          <Divider section/>
          <Accordion panels={panels} styled fluid activeIndex={this.state.active_index} onTitleClick={this._setActiveIndex}/> {media_form}
          <Button content='Guardar' primary/><Button content='Cancelar' onClick={this.handleCancel} secondary/>
        </Form>
      </Segment>
    );
  }

  _renderLayoutForm() {
    let layout = '';
    let p = {
      props: this.props,
      change: this.handleChange,
      state: this.state
    };
    layout = <LayoutClickForm {...p}/>;
    return (
      <Segment attached>
        {layout}
      </Segment>
    );
  }

  render() {
    if (this.props.model.tab === 'form') {
      return this._renderFieldsForm();
    }
    if (this.props.model.tab === 'layout') {
      return this._renderLayoutForm();
    }
  }
};

export default ClickForm;
