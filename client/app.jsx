import React from 'react';
import ChefProfile from './pages/chef';
import SignUpPage from './pages/sign-up';
import NavBar from './components/nav-bar';
import parseRoute from './lib/parse-route';
import SignInPage from './pages/sign-in';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <SignUpPage />;
    }
    if (route.path === 'sign-in') {
      return <SignInPage />;
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.renderPage()}
        <ChefProfile />
      </div>
    );
  }
}

export default App;
