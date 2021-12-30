import React from 'react';
import SignupForm from '../components/signup-form';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.addNewUser = this.addNewUser.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addNewUser(newUser) {
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(response => response.json())
      .then(newUser => {
        this.setState({ users: [].concat(this.state.users, newUser) });
        window.location.hash = 'sign-in';
      })
      .catch(err => console.error(err));
  }

  handleClick() {
    window.location.hash = 'sign-in';
  }

  render() {
    return (
      <div>
        <h1 className="text-align-center padding-top-bottom-3">Sign-Up</h1>
        <SignupForm className="margin-bottom" onSubmit={this.addNewUser} />
        <h4 className="text-align-center">Already have an account? <a onClick={this.handleClick}>Sign-in</a></h4>
      </div>
    );
  }
}

export default SignUpPage;
