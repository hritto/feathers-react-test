import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import client from '../../modules/common/client.js';

export default class LoginViewSemantic extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateField(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  login() {
    const { email, password } = this.state;
    this.props.controller.userAuthenticate({
      strategy: 'local',
      email, password
    }).then(token => {
      this.props.controller.setCurrentUser(token, this.state);
    }).catch((error) => {
      console.log(error)
      this.setState({ error })
    });
  }

  signup() {
    const { email, password } = this.state;
    const users = client.service('/users');
    return users.create(
      {
        "name": "Test",
        "surname": "User",
        "email": "test@test.com",
        "gender": "female",
        "role": "editor",
        "active": 1,
        "password": "123456",
        "photo": "/assets/images/avatar/avatar_45.png"
      })
      .then((token) => {
        this.login()
      }).catch((e) => {
        console.log(e);
      });
  }

  componentDidMount() {
    $('.login_form').animateCss('fadeIn');
  }


  render() {
    return (
    <div className='login-form'>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='blue' textAlign='center'>
              <Icon name='user' />
              {' '}Introduzca sus credenciales
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Message
                  error
                  header={'Credenciales no válidas'}
                  content={'Los datos introducidos no son válidos.'} />
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  name="username"
                  placeholder='Usuario / Email'
                  onChange={ev => this.updateField('email', ev)} />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder="Contraseña"
        					name="password"
                  type='password'
                  onChange={ev => this.updateField('password', ev)} />

                <Button type="button" fluid size='large' primary onClick={() => this.login()}>
                  Entrar
                </Button>
                {/*<button type="button" className="button button-primary block signup" onClick={() => this.signup()}>
                  Signup
                </button>*/}
              </Segment>
            </Form>
            <Message>
              No tienes cuenta? <a href='#'>Créala aquí</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>);
  }
}
