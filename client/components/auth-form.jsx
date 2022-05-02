import React from 'react';
import AppContext from '../lib/app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGuestLogin = this.handleGuestLogin.bind(this);
  }

  componentDidMount() {
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'GuestUser',
        password: 'testing123'
      })
    })
      .then(res => res.json());
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

  handleGuestLogin() {
    fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'GuestUser',
        password: 'testing123'
      })
    })
      .then(res => res.json())
      .then(guestLogIn => {
        this.props.onSignIn(guestLogIn);
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit, handleGuestLogin } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternateActionText = action === 'sign-up'
      ? 'Sign in'
      : 'Register';
    const alternateActionDesc = action === 'sign-up'
      ? 'Already have an account?'
      : "Don't have an account?";
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const welcomeMessage = action === 'sign-up'
      ? 'SIGN UP'
      : 'LOG IN';
    const usernameLengthNot = action === 'sign-up'
      ? 'd-flex justify-content-center mt-2'
      : 'hidden';
    const usernameLengthNotClass = this.state.username.length < 9 && this.state.username.length > 0
      ? 'green'
      : 'red';
    let submitButtonRes;
    // const submitButtonRes = usernameLengthNotClass === 'green'
    //   ? <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button>
    //   : <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">Finish</div>;
    // if (action === 'sign-in') {
    //   return;
    // } else if (usernameLengthNotClass !== 'green') {
    //   submitButtonRes = <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">Finish</div>;
    // } else {
    //   submitButtonRes = <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button>;
    // }
    if (action === 'sign-in') {
      submitButtonRes = <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button>;
    } else if (action === 'sign-up' && usernameLengthNotClass !== 'green') {
      submitButtonRes = <div className="d-flex justify-content-center align-items-center w-100 gap-2 reg-button-grey rounded">Register</div>;
    } else {
      submitButtonRes = <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button>;
    }
    return (
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
            {/* <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button> */}
            {submitButtonRes}
          </div>
          <div className="mb-4">
            <p className="text-center">
              {alternateActionDesc}&nbsp;&nbsp;
              <a href={alternateActionHref}>
                {alternateActionText}
              </a>
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <a href="#search" onClick={handleGuestLogin}>Continue as Guest</a>
          </div>
          <div className={usernameLengthNot}>
            <p className={usernameLengthNotClass}>Username must be maximum 9 characters&nbsp;<FontAwesomeIcon icon={this.state.username.length < 9 && this.state.username.length > 0 ? faCheck : faX}/></p>
          </div>
        </form>
      </div>
    );
  }
}

AuthForm.ContextType = AppContext;
