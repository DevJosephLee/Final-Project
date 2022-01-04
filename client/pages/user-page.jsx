import React from 'react';
// import AppContext from '../lib/app-context';
// import decodeToken from '../lib/decode-token';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null
    };
  }

  componentDidMount() {
    fetch(`/api/userProfile/${this.props.userId}`)
      .then(response => response.json())
      .then(result => {
        const [username] = result;
        this.setState({ username: username.username });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container height-100">
        <div className="width-adj padding-top-bottom">
          <div className="row justify-center">
            <div className="row user-icon-container align-center justify-center">
              <i className="far fa-grin user-icon"></i>
            </div>
          </div>
          <div className="text-align-center">
            <h3>{this.state.username}</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;

// what to fetch for profile page
// username
// watchlist
// reviews
