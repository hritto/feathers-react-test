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
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.myDropzone = null;
        this._getPanelContent = this._getPanelContent.bind(this);
        this._renderForm = this._renderForm.bind(this);
        this._renderLayoutForm = this._renderLayoutForm.bind(this);
        this._setActiveIndex = this._setActiveIndex.bind(this);
        this._setAddMedia = this._setAddMedia.bind(this);
        this._addMediaState = this._addMediaState.bind(this);
        this._setErrors = this._setErrors.bind(this);
        //this._getMediaForm = this._getMediaForm.bind(this);
    }

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
            const lens = R.lensProp('active_index');
            return R.set(lens, val, state);
        });
        window.dispatchEvent(new Event('resize'));
    };

    handleChange(event, result) {
        let pr = event.target.name;
        let val = event.target.value
        let lensP = R.split('.', pr);
        this.setState((state) => {
            const lens = R.lensPath(lensP);
            return R.set(lens, val, state);
        });
    }

    changeColor(lens, color) {
        let val = color;
        let lensP = lens;
        this.setState((state) => {
            const lens = R.lensPath(lensP);
            return R.set(lens, val, state);
        });
    }

    handleCheck(event, result) {
        let pr = result.name;
        let val = result.checked
        let lensP = R.split('.', pr);
        this.setState((state) => {
            const lens = R.lensPath(lensP);
            return R.set(lens, val, state);
        });
    }

    handleSelect(event, result) {
        let pr = result.name;
        let val = result.value
        let lensP = R.split('.', pr);
        this.setState((state) => {
            const lens = R.lensPath(lensP);
            return R.set(lens, val, state);
        });
    }

    handleSubmit(event) {
        this.props.controller.handleSubmit(this.state);
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
            check: this.handleCheck,
            select: this.handleSelect,
            color: this.changeColor,
            state: this.state,
            index: i,
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
        });

        console.log(this.state)
    }


    _renderForm() {
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
            return this._renderForm();
        }
        if (this.props.model.tab === 'layout') {
            return this._renderLayoutForm();
        }
    }

};


export default ClickForm