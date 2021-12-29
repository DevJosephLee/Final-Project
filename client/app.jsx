import React from 'react';
import ChefProfile from './pages/chef';
import SignInPage from './pages/sign-in';
import NavBar from './components/nav-bar';
// import parseRoute from './lib/parse-route';

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       route: parseRoute(window.location.hash)
//     };
//   }

//   componentDidMount() {
//     window.addEventListener('hashchange', () => {
//       this.setState({ route: parseRoute(window.location.hash) });
//     });
//   }

//   renderPage() {
//     const { route } = this.state;
//     if (route.path === '') {
//       return <SignInPage />;
//     }
//     if (route.path === 'chefs') {
//       return <ChefProfile />;
//     }
//   }

//   render() {
//     return (
//       <>
//         {this.renderPage()}
//       </>
//     );
//   }
// }
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
