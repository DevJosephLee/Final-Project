import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauthorizedModalOpen: false
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
        } else if (!result.user && !result.token) {
          this.setState({ unauthorizedModalOpen: true });
        }
        // else if (result.error === 'invalid login') {
        //   this.setState({ unauthorizedModalOpen: true });
        // } else {
        //   this.setState({ unauthorizedModalOpen: false });
        // }
        // else if (result.userId && result.createdAt) {
        //   this.setState({ unauthorizedModalOpen: false });
        // }
        // else if (action === 'sign-in' && !result.user && !result.token) {
        //   this.setState({ unauthorizedModalOpen: true });
        // } else if (action !== 'sign-in') {
        //   this.setState({ unauthorizedModalOpen: false });
        // }
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
    const dataBsToggle = this.state.unauthorizedModalOpen && action === 'sign-in'
      ? ''
      : 'modal';
    const dataBsTarget = this.state.unauthorizedModalOpen && action === 'sign-in'
      ? ''
      : '#unauthorizedModal';
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
            <button type="submit" className="btn btn-primary btn-lg w-100" data-bs-toggle={dataBsToggle} data-bs-target={dataBsTarget}>{submitButtonText}</button>
            {/* <button type="submit" className="btn btn-primary btn-lg w-100">{submitButtonText}</button> */}

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
        </form>
        <div className="modal fade" id="unauthorizedModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel">Failed!</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Username or Password are incorrect.
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AuthForm.ContextType = AppContext;

// modal must not open when going from sign-up to sign-in
// modal must open when in sign-in, unath access
// modal must not open on any other components other than sign-in
