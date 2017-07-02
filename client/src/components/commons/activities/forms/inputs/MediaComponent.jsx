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
    if (R.type(props.options.image) === 'Object') {
        config.image = props.options.image.image;
    }
    /*
    name={R.join('.', ['code', scene_index, 'elements', el_key])} 
    title = 'Mostrar la instrucción al iniciar' 
    field = {['code', scene_index, 'elements', el_key]} 
    options = {{image: el.image,
    sound: el.sound,
    text: el.text
    }}
    */
    //console.log(props.options)
    //console.log(props.name)
    //console.log(R.view(R.lensPath(props.field), props.state))
    const addMedia = (opts) => {
        props.media(opts)
    };

    return (
        <div className='ui two buttons' key={'extra_div_' + _.uniqueId()}>
            <Button.Group>
                <Button icon='image' color='green' onClick={addMedia.bind(this, { action: 'image', lens: props.field, media_name: config.image, media_description: '' })} />
                <Button icon='music' color='blue' onClick={addMedia.bind(this, { action: 'audio', lens: props.field, media_name: config.sound, media_description: '' })} />
                <Button icon='file text outline' color='orange' onClick={addMedia.bind(this, { action: 'text', lens: props.field, media_name: config.text, media_description: '' })} />
            </Button.Group>
        </div>
    )
}

export default MediaComponent;

