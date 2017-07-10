import React from 'react';
import { Container, Header, Icon, Segment, Accordion, Form, Button, Menu, Label, Divider, Card, Image } from 'semantic-ui-react';
import SimpleInputHidden from '../inputs/HiddenSimple.jsx';
import R from 'ramda'


const MediaComponent = (props) => {
    let config = {
        image: props.options.image,
        sound: props.options.sound,
        text: props.options.text
    }
    let class_image = props.options.enabled.image ? 'normal' : 'btn_invisible';
    let class_sound = props.options.enabled.sound ? 'normal' : 'btn_invisible';
    let class_text = props.options.enabled.text ? 'normal' : 'btn_invisible';
    if (R.type(props.options.image) === 'Object') {
        config.image = props.options.image.image;
    }
    const addMedia = (opts) => {
        props.media(opts)
    };

    return (
        <div className='ui two buttons' key={'extra_div_' + _.uniqueId()}>
            <Button.Group>
                <Button icon='image' className={class_image} disabled={!props.options.enabled.image} color='green' onClick={addMedia.bind(this, { action: 'image', lens: props.field, media_name: config.image, media_description: '' })} />
                <Button icon='music' className={class_sound} disabled={!props.options.enabled.sound} color='blue' onClick={addMedia.bind(this, { action: 'audio', lens: props.field, media_name: config.sound, media_description: '' })} />
                <Button icon='file text outline' className={class_text} disabled={!props.options.enabled.text} color='orange' onClick={addMedia.bind(this, { action: 'text', lens: props.field, media_name: config.text, media_description: '' })} />
            </Button.Group>
        </div>
    )
}

export default MediaComponent;
