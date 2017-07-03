import React, { Component } from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu } from 'semantic-ui-react';
import FormPanel from './FormPanel.jsx';
import RibbonHeader from '../../../header.jsx';
import MediaModalView from '../../../MediaModal.jsx'
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
            error_messages: []
        });
        this.handleChange = this.handleChange.bind(this);
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
    }

    _updateModel() {
        this.props.controller.updateActivityCode({
            code: this.state.code,
            media: this.state.media
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
    }


    _setActiveIndex(e, i) {
        let val = i;
        if (this.state.active_index === i) {
            val = null;
        }
        this.setState((state) => {
            return R.set(R.lensProp('active_index'), val, state);
        });
        window.dispatchEvent(new Event('resize'));
    };

    handleChange(lens, value) {
        this.setState((state) => {
            return R.set(R.lensPath(lens), value, state);
        }, function () {
            this._updateModel();
        });
    }

    handleDeleteElement(element_id, i) {
        this.setState((state) => {
            const st = R.clone(state);
            delete st.code[i].elements[element_id];
            return st;
        }, function () {
            this._updateModel();
        });
    }

    handleCreateElement(element, i, name) {
        this.setState((state) => {
            const st = R.clone(state);
            st.code[i].elements[name] = element;
            return st;
        }, function () {
            this._updateModel();
        });
    }

    handleSubmit(event) {
        this._updateModel();
        event.preventDefault();
    }

    handleCancel(event) {
        this.props.controller.handleCancel(this.state);
        event.preventDefault();
    }

    _getPanelContent(code, i) {
        let p = {
            props: this.props,
            change: this.handleChange,
            state: this.state,
            index: i,
            handleDeleteElement: this.handleDeleteElement,
            handleCreateElement: this.handleCreateElement,
            media: this._setAddMedia
        };
        return FormPanel(p);
    }

    _getMediaForm() {
        let p = {
            props: this.props,
            state: this.state,
            media: this._setAddMedia,
            error: this._setErrors,
            addMedia: this._addMediaState,
            change: this.handleChange
        };
        return <MediaModalView {...p} />
    }

    _setAddMedia(opts) {
        this.setState((state) => {
            return {
                addMedia: opts.action,
                media_lens: opts.lens,
                media_name: opts.name,
                media_description: opts.description
            };
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
            return {
                addMedia: null,
                media_lens: [],
                media_name: '',
                media_description: '',
                error_messages: []
            };
        }, function () {
            this._updateModel();
            console.log(this.state)
        });
    }


    _renderFieldsForm() {
        const self = this;
        const mapIndexed = R.addIndex(R.map);
        let media_form = ''
        const panels = mapIndexed(function (code, i) {
            return self._getPanelContent(code, i);
        }, this.props.model.activity_code.code);
        if (this.state.addMedia) {
            media_form = this._getMediaForm();
        }

        return (
            <Segment attached>
                <Form onSubmit={this.handleSubmit}>
                    <Accordion panels={panels} styled fluid
                        activeIndex={this.state.active_index}
                        onTitleClick={this._setActiveIndex}
                    />
                    {media_form}
                    <Button content='Guardar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
                </Form>
            </Segment>
        );
    }

    _renderLayoutForm() {
        return (
            <Segment attached>
                <Button content='Guardar' primary /><Button content='Cancelar' onClick={this.handleCancel} secondary />
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


export default ClickForm