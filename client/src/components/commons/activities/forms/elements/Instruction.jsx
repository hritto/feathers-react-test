import React from 'react'
import R from 'ramda'
import SimpleInputText from '../inputs/TextSimple.jsx';
import MediaComponent from '../inputs/MediaComponent.jsx';

const IntructionComponent = (props) => {
  debugger;
  return (
    <div>
      <SimpleInputText key={'instruction' + _.uniqueId()} {...props}
        name={'instruction_text' + _.uniqueId()}
        title='Instrucción'
        field={['code', props.index, 'instruction', 'text']} />
      <MediaComponent {...props}
        name={'audio_instruction'}
        title='Añadir medios'
        field={['code', props.index, 'instruction', 'sound']}
        options={{
          image: null,
          sound: props.state[props.index].instruction.sound,
          text: null,
          enabled: {
            image: false,
            sound: true,
            text: false,
          }
        }} />
    </div>
  )
};

export default IntructionComponent