import React from 'react';
import StarRating from '../components/star-rating';

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

    fetch(`/api/userProfile/chefs/${this.props.userId}`)
      .then(response => response.json())
      .then(result => {
        this.setState({ chefs: result });
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
          <div className="margin-top-bottom">
            <h1>Saved Chefs</h1>
            {
              this.state.chefs.map(chef => {
                return (
                  <div key={chef.chefId} className="margin-top-bottom-2">
                    <div className="favorites-container">
                      <div className="row">
                        <img className="profile-picture-favorites" src={chef.photoUrl} />
                        <div className="margin-left">
                          <h3 className="saved-chefs-text">{chef.name}</h3>
                          <div className="row align-center">
                            <StarRating rating={chef.avg} />
                            <p className="margin-left saved-chefs-text">{chef.count} Reviews</p>
                          </div>
                          <p className="saved-chefs-text">{chef.cuisineType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
