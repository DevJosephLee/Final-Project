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
      <div className="container">
        <div className="row justify-center">
          <form onSubmit={this.handleSubmit}>
            <div className='margin-bottom'>
              <label className="label" htmlFor='username'>Username</label>
              <div>
                <input
                  className="inputs"
                  required
                  autoFocus
                  type="text"
                  value={usernameValue}
                  onChange={this.handleUserNameChange}
                  id='username' />
              </div>
            </div>
            <div className="margin-bottom">
              <label className="label" htmlFor='password'>Password</label>
              <div>
                <input
                  className="inputs"
                  required
                  autoFocus
                  type="password"
                  value={passwordValue}
                  onChange={this.handlePasswordChange}
                  id='password' />
              </div>
            </div>
            <div className="row justify-end">
              <button className='submit-buttom' type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SignupForm;
