import React, { Component } from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu } from 'semantic-ui-react';
import FormPanel from './FormPanel.jsx';
import RibbonHeader from '../../../header.jsx';
import R from 'ramda';

class ClickForm extends Component {
    constructor(props) {
        super(props);
        this.state = R.merge(props.model.activity_code, {
            active_index: null
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
            index: i
        };
        return FormPanel(p);
    }

    _renderForm() {
        const self = this;
        const mapIndexed = R.addIndex(R.map);
        const panels = mapIndexed(function (code, i) {
            return self._getPanelContent(code, i);
        }, this.props.model.activity_code.code)
        return (
            <Segment attached>
                <Form onSubmit={this.handleSubmit}>
                    <Accordion panels={panels} styled fluid
                        activeIndex={this.state.active_index}
                        onTitleClick={this._setActiveIndex}
                    />
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