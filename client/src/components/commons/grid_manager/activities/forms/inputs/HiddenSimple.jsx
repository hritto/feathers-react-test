import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import R from 'ramda'

const SimpleInputHidden = (props) => <Input key={'_' + props.title}
        type='hidden'
        name={props.name}
        value={R.view(R.lensPath(props.field), props.state) || ''} />

export default SimpleInputHidden
