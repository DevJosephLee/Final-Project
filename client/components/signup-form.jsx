import React from 'react';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserNameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.onSubmit(newUser);
    this.setState({ username: '', password: '' });
  }

  render() {
    const usernameValue = this.state.username;
    const passwordValue = this.state.password;
    return (
      <form className="text-align-center" onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <div>
            <input
              required
              autoFocus
              type="text"
              value={usernameValue}
              onChange={this.handleUserNameChange}
              id='username' />
          </div>
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <div>
            <input
              required
              autoFocus
              type="password"
              value={passwordValue}
              onChange={this.handlePasswordChange}
              id='password' />
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default SignupForm;
