import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputHidden = (props) => <Input key={'_'+props.campo}
        type='hidden'
        name={props.campo}
        value={props.state[props.campo]} />

export default SimpleInputHidden
