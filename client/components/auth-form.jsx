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
        } else if (action === 'sign-in' && result.user && result.token) {
          this.props.onSignIn(result);
          window.location.hash = 'search';
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternateActionText = action === 'sign-up'
      ? 'Sign in'
      : 'Register now';
    const alternateActionDesc = action === 'sign-up'
      ? 'Already have an account?'
      : "Don't have an account?";
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const welcomeMessage = action === 'sign-up'
      ? 'SIGN UP'
      : 'LOG IN';
    return (
      <div className="container">
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-center mb-5 mt-3">{welcomeMessage}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label">Username</label>
              <input onChange={handleChange} type="text" name="username" className="form-control" id="usernameInput" aria-describedby="usernameHelp" required autoFocus />
            </div>
            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input onChange={handleChange} type="password" name="password" className="form-control" id="passwordInput" required />
            </div>
            <div className="mb-4">
              <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button>
            </div>
            <div className="mb-4">
              <p className="text-center">
                {alternateActionDesc}&nbsp;&nbsp;
                <a href={alternateActionHref}>
                  {alternateActionText}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AuthForm.ContextType = AppContext;

/* <form onSubmit={handleSubmit}>
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
        </form> */
