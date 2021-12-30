import React from 'react';
import SignupForm from '../components/signup-form';

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.location.hash = '';
  }

  render() {
    return (
      <div>
        <h1 className="text-align-center padding-top-bottom-3">Sign-In</h1>
        <SignupForm />
        <h4 className="text-align-center">Dont have an account? <a onClick={this.handleClick}>Sign-up</a></h4>
      </div>
    );
  }
}

export default SignInPage;
