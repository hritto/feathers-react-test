import React, { Component } from 'react';
//import {Form, Message, Grid, Button, Segment, Header, Container, Icon, Input} from 'semantic-ui-react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import client from '../../modules/common/client.js';

export default class LoginView extends Component {
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
    <div className='login_form'>
      <Segment inverted className='no-margin' >
        <Header as='header' inverted>
        {/*<img className='header_logo' src='../assets/images/vivitbooks_logo.png' />*/}
        Header Content
        </Header>
      </Segment>
      <Container className='segment_spacer'></Container>
      <Grid centered columns={1} textAlign="center" relaxed>
        <Grid.Row textAlign="left">
    			<Grid.Column tablet={10} mobile={16} computer={6}>
            <Segment attached style={{padding:0}}>
              <Header as='h2' block className='top_a'>
                <Icon name='user' />
                <Header.Content style={{textAlign:'left'}}>
                  Login
                  <Header.Subheader>
                    Introduzca sus credenciales
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Segment>

            <Segment attached>
      				<Form>
      					<Message
      						error
      						header={'Invalid credentials'}
      						content={'Your credentials are invalid.'} />
                <Form.Field>
                  <label style={{textAlign:'left'}}>Usuario / Email</label>
                  <Input icon placeholder="Usuario / Email"
        						name="username"
        						onChange={ev => this.updateField('email', ev)}>
                    <input />
                    <Icon name='user' />
                  </Input>
                </Form.Field>
                <Form.Field>
                  <label style={{textAlign:'left'}}>Contraseña</label>
                  <Input icon placeholder="Contraseña"
        						name="password"
                    type="password"
        						onChange={ev => this.updateField('password', ev)}>
                    <input />
                    <Icon name='lock' />
                  </Input>
                </Form.Field>
                </Form>
              </Segment>

              <Segment attached style={{padding:0}}>
                <Header as='h2' block className='bottom_a'>
                  <Header.Content>
                    <Button type="button" primary onClick={() => this.login()}>
                      Entrar
                    </Button>
                    {/*<button type="button" className="button button-primary block signup" onClick={() => this.signup()}>
                      Signup
                    </button>*/}
                  </Header.Content>
                </Header>
              </Segment>
    			</Grid.Column>
    		</Grid.Row>
  	  </Grid>
    </div>);
  }
}
