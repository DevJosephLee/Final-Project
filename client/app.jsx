import React from 'react';
// import Home from './pages/home';
import ChefProfile from './pages/chef-profile';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chefs: []
    };
  }

  componentDidMount() {
    fetch('api/chefs')
      .then(response => response.json())
      .then(data => {
        this.setState({ chefs: data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return <ChefProfile />;
  }
}
