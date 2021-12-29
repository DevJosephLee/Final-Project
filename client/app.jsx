import React from 'react';
import ChefProfile from './pages/chef';
import SignInPage from './pages/sign-in';

function App(props) {
  return (
    <div>
      <SignInPage />
      <ChefProfile />
    </div>
  );
}

export default App;
