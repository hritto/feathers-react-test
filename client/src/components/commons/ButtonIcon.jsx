import React from 'react'
import { Button, Icon, Header, Image, Modal } from 'semantic-ui-react'

const ModalTest = (props) => (
  <Modal trigger={<Button.Group>
    <Button icon='pencil' size='tiny' />
    <Button icon='delete' size='tiny' />
  </Button.Group>}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content image>
      <Image wrapped size='medium' src='/assets/images/avatar/large/rachel.png' />
      <Modal.Description>
        <Header>Default Profile Image</Header>
        <p>We've found the following gravatar image associated with your e-mail address.</p>
        <p>Is it okay to use this photo?</p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

const ButtonIcon = (props) => (
  <Button.Group>
    <Button icon='pencil' size='tiny' />
    <Button icon='delete' size='tiny' />
  </Button.Group>
)

export default ModalTest
