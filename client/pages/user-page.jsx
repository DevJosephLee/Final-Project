import React from 'react';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chefs: [],
      reviews: []
    };
  }

  componentDidMount() {
    fetch(`/api/userProfile/${this.props.userId}`)
      .then(response => response.json())
      .then(result => {
        const [user] = result;
        this.setState({ username: user.username });
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
