import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import AuthPage from './pages/auth';
import ChefProfile from './pages/chef';
import NavBar from './components/nav-bar';
import SearchPage from './pages/search';
import SearchResultPage from './pages/search-result';

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
    const { route } = this.state;
    if (route.path === 'chefProfile') {
      const chefId = route.params.get('chefId');
      return <ChefProfile chefId={chefId} />;
    }
    if (route.path === 'sign-in' || route.path === 'sign-up') {
      return <AuthPage />;
    }
    if (route.path === 'search') {
      return <SearchPage />;
    }
    if (route.path === 'searchResults') {
      const selectedCuisine = route.params.get('cuisine');
      return <SearchResultPage selectedCuisine={selectedCuisine} />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <div>
        <AppContext.Provider value={contextValue}>
          <>
            <NavBar user={this.state.user} />
            {this.renderPage()}
          </>
        </AppContext.Provider>
      </div>
    );
  }
}
