import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import Auth from './pages/auth';
import ChefProfile from './pages/chef';
import NavBar from './components/nav-bar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('final-project-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('final-project-jwt', token);
    this.setState({ user });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <ChefProfile />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <Auth />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <div className="">
        <AppContext.Provider value={contextValue}>
          <>
            <NavBar />
            {this.renderPage()}
          </>
        </AppContext.Provider>
      </div>
    );
  }
}
