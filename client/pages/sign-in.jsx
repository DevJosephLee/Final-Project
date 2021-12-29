import React from 'react';
import SignupForm from '../components/signup-form';

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.addNewUser = this.addNewUser.bind(this);
  }

  componentDidMount() {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        this.setState({ users: data });
      })
      .catch(err => console.error(err));
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
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1 className="text-align-center padding-top-bottom-3">Sign-Up</h1>
        <SignupForm onSubmit={this.addNewUser} />
      </div>
    );
  }
}

export default SignInPage;
