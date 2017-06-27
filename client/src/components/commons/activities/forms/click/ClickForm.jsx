import React from 'react';
import { Container, Header, Icon, Segment, Accordion } from 'semantic-ui-react';
import RibbonHeader from '../../../header.jsx';
import R from 'ramda';


const ClickForm = (props) => {
    const mapIndexed = R.addIndex(R.map);
    const panels = mapIndexed(function(code, i) {
        return {
            title: 'Escena ' + i + " - " + code.instruction.text,
            content: code.instruction.text,
        }
    }, props.model.activity_code.code)

    return (
    <Segment attached>
       <Accordion panels={panels} styled fluid />
    </Segment>
    );
};

export default ClickForm