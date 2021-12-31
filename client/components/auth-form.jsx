import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    fetch(`/api/auth/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
        window.location.hash = 'search';
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternateActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const alternateActionDesc = action === 'sign-up'
      ? 'Already have an account?'
      : "Don't have an account?";
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    return (
      <div className="container">
        <div className="row justify-center padding-bottom-2">
          <form onSubmit={handleSubmit}>
            <div className='margin-bottom'>
              <label className="label-signin" htmlFor='username'>Username</label>
              <div>
                <input
                  className="inputs-signin"
                  required
                  autoFocus
                  type="text"
                  name="username"
                  onChange={handleChange}
                  id='username' />
              </div>
            </div>
            <div className="margin-bottom">
              <label className="label-signin" htmlFor='password'>Password</label>
              <div>
                <input
                  className="inputs-signin"
                  required
                  type="password"
                  name="password"
                  onChange={handleChange}
                  id='password' />
              </div>
            </div>
            <div className="row justify-between align-center padding-top-bottom-4">
              <p>
                {alternateActionDesc}&nbsp;&nbsp;
                <a href={alternateActionHref}>
                  {alternateActionText}
                </a>
              </p>
              <button className='submit-button' type="submit">{submitButtonText}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AuthForm.ContextType = AppContext;
