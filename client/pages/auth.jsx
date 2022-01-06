import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  render() {
    const { user, route, handleSignIn } = this.context;
    if (user) return <Redirect to="" />;

    // const welcomeMessage = route.path === 'sign-in'
    //   ? 'Sign In'
    //   : 'Create Account';
    return (
      <div className="container p-5">
        <div className="">
          <div className="text-center">
            <img src='/images/logo.png' className='w-50 m-5' />
          </div>
          {/* <h1 className="text-align-center margin-top-bottom">{welcomeMessage}</h1> */}
          <div>
            <AuthForm
              key={route.path}
              action={route.path}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
