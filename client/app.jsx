import React from 'react';
import ChefProfile from './pages/chef';
import SignInPage from './pages/sign-in';
import NavBar from './components/nav-bar';

function App(props) {
  return (
    <div>
      <NavBar />
      <SignInPage />
      <ChefProfile />
    </div>
  );
}

export default App;
