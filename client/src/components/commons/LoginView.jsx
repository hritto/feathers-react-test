import React, { Component } from 'react';

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
      debugger;
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


  render() {
    return <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <p>{this.state.error && this.state.error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            <fieldset>
              <input className="block" type="email" name="email" placeholder="email" onChange={ev => this.updateField('email', ev)} />
            </fieldset>

            <fieldset>
              <input className="block" type="password" name="password" placeholder="password" onChange={ev => this.updateField('password', ev)} />
            </fieldset>

            <button type="button" className="button button-primary block signup" onClick={() => this.login()}>
              Log in
            </button>

            {/*<button type="button" className="button button-primary block signup" onClick={() => this.signup()}>
              Signup
            </button>*/}

          </form>
        </div>
      </div>
    </main>;
  }
}
