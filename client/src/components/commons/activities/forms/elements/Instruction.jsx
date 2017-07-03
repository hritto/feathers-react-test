import React from 'react'
import R from 'ramda'
import SimpleInputText from '../inputs/TextSimple.jsx';

const IntructionComponent = (props) => {
  return (
    <div>
      <SimpleInputText key={'instruction' + _.uniqueId()} {...props}
        name={R.join('.', ['code', props.index, 'instruction', 'text'])}
        title='Instrucción'
        field={['code', props.index, 'instruction', 'text']} />
      <div>Audio:TODO</div>
    </div>
  )
};

export default IntructionComponent