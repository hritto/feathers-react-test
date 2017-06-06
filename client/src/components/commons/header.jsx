import React from 'react'
import { Header, Icon } from 'semantic-ui-react'

const RibbonHeader = (props) => {
  return (<Header as='h2' block inverted className='ribbon_header'>
    <Icon name={props.model.icon} />
    <Header.Content>
      {props.model.title}
    </Header.Content>
  </Header>
)}

export default RibbonHeader
