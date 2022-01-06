import React from 'react';
import StarRating from '../components/star-rating';
import DeleteConfModal from '../components/delete-conf-modal';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chefs: [],
      reviews: [],
      confModalOpened: false
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.closeConfModal = this.closeConfModal.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('final-project-jwt');
    fetch('/api/userProfile', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(result => {
        const [user] = result;
        this.setState({ username: user.username });
      })
      .catch(err => console.error(err));

    fetch('/api/userProfile/chefs', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(result => {
        this.setState({ chefs: result });
      })
      .catch(err => console.error(err));

    fetch('/api/userProfile/reviews', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(result => {
        this.setState({ reviews: result });
      })
      .catch(err => console.error(err));
  }

  handleDeleteClick(event) {
    const token = window.localStorage.getItem('final-project-jwt');
    const chefId = event.target.getAttribute('chefId');
    fetch(`/api/userProfile/${chefId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(() => {
        const newChefArray = this.state.chefs.filter(chef => {
          return !chefId.includes(chef.chefId);
        });
        this.setState({ chefs: newChefArray });
      })
      .catch(err => console.error(err));
    this.setState({ confModalOpened: true });
  }

  closeConfModal() {
    this.setState({ confModalOpened: false });
  }

  render() {
    const confModalClass = this.state.confModalOpened
      ? 'show'
      : 'hidden';
    return (
      <div className="container">
        <div className="width-adj">
          <div className="margin-top-bottom">
            <div className="row justify-center">
              <div className="row user-icon-container align-center justify-center">
                <i className="far fa-grin user-icon"></i>
              </div>
            </div>
            <div className="text-align-center">
              <h3>{this.state.username}</h3>
            </div>
          </div>
          <div className="margin-top">
            <h1>Saved Chefs</h1>
            {
              this.state.chefs.map(chef => {
                return (
                  <div key={chef.chefId} className="margin-top-bottom-2">
                    <div className="favorites-container">
                      <div className="row">
                        <img className="profile-picture-favorites" src={chef.photoUrl} />
                        <div className="margin-left">
                          <div className="row justify-between align-center">
                            <h3 className="saved-chefs-text">{chef.name}</h3>
                            <i chefid={chef.chefId} className="far fa-trash-alt trash-button" onClick={this.handleDeleteClick}></i>
                          </div>
                          <div className="row align-center">
                            <StarRating rating={chef.avg} />
                            <p className="margin-left saved-chefs-text">{chef.count} Reviews</p>
                          </div>
                          <p className="saved-chefs-text">{chef.cuisineType}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`height-100 overlay ${confModalClass}`}>
                      <DeleteConfModal closeConfModal={this.closeConfModal} />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div className="padding-bottom">
            <h1>My Reviews</h1>
            {
              this.state.reviews.map(review => {
                return (
                  <div key={review.reviewId} className="margin-top-bottom-2">
                    <div className="row">
                      <img src={review.photoUrl} className="profile-picture-favorites" />
                      <div className="margin-left">
                        <h3>{review.name}</h3>
                        <StarRating rating={review.rating} />
                        <p>{review.content}</p>
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
