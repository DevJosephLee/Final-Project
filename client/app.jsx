import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import AuthPage from './pages/auth';
import ChefProfile from './pages/chef';
import NavBar from './components/nav-bar';
import SearchPage from './pages/search';
import SearchResultPage from './pages/search-result';
import MakeChefProfilePageBio from './pages/make-chef-profile-bio';
import MakeChefProfilePageCuisine from './pages/make-chef-profile-cuisine';
import MakeChefProfilePageDishes from './pages/make-chef-profile-dishes';
import UserPage from './pages/user-page';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash),
      hideSpinner: false
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('user-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
    this.setState({ hideSpinner: true });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('user-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('user-jwt');
    this.setState({ user: null });
    window.location.hash = 'sign-in';
  }

  renderPage() {
    const { route } = this.state;
    const chefId = route.params.get('chefId');
    if (route.path === 'chefProfile') {
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
    if (route.path === 'userProfile') {
      return <UserPage />;
    }
    if (route.path === 'becomeChefBio') {
      return <MakeChefProfilePageBio chefId={chefId}/>;
    }
    if (route.path === 'becomeChefCuisine') {
      return <MakeChefProfilePageCuisine chefId={chefId}/>;
    }
    if (route.path === 'becomeChefDishes') {
      return <MakeChefProfilePageDishes chefId={chefId} />;
    }
    return <AuthPage />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    const loaderClass = this.state.hideSpinner
      ? 'd-none'
      : 'd-flex justify-content-center mt-5';
    return (
      <div>
        <AppContext.Provider value={contextValue}>
          <>
            <NavBar goToProfile={this.handleProfileClick} user={this.state.user} route={this.state.route.path} handleSignOut={this.handleSignOut} />
            {this.renderPage()}
            <div className={loaderClass}>
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
          </>
        </AppContext.Provider>
      </div>
    );
  }
}
