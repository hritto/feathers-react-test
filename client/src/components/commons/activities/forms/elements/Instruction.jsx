import React from 'react'
import R from 'ramda'
import SimpleInputText from '../inputs/TextSimple.jsx';

const IntructionComponent = (props) => {
  return (
    <SimpleInputText key={'instruction' + _.uniqueId()} {...props}
      name={R.join('.', ['code', props.index, 'instruction', 'text'])} />
  )
};

export default IntructionComponent