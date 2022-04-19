import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';
import CuisineTypes from '../components/cuisine-types';
import ReviewModal from '../components/review-modal';
import decodeToken from '../lib/decode-token';

class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chef: [],
      reviews: [],
      savedChefs: [],
      rating: 1,
      photoUrl: 'images/testing-image.jpeg',
      isSaved: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/chefs/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ chef: data });
      })
      .catch(err => {
        console.error(err);
      });

    fetch(`/api/reviews/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ reviews: data });
      })
      .catch(err => console.error(err));

    fetch('/api/userProfile/chefs', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ savedChefs: data });
      })
      .catch(err => console.error(err));

    fetch('/api/images', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ photoUrl: data[0].photoUrl });
      })
      .catch(err => console.error(err));

    this.setState({ isLoaded: true });
  }

  handleTextChange(event) {
    this.setState({ content: event.target.value });
  }

  handleStarClick() {
    this.setState({ rating: event.target.getAttribute('rating') });
  }

  handleSubmit(newReview) {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/review/${this.props.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(newReview => {
        const payload = decodeToken(token);
        newReview.username = payload.username;
        newReview.photoUrl = this.state.photoUrl;
        this.setState({ reviews: [].concat(this.state.reviews, newReview) });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleClickSave() {
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/userProfile/${this.props.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      }
    });
    this.setState({ isSaved: true });
  }

  render() {
    const savedChefIdsArray = [];
    let currentChefId = '';
    for (let i = 0; i < this.state.savedChefs.length; i++) {
      const savedChefIds = this.state.savedChefs[i].chefId;
      savedChefIdsArray.push(savedChefIds);
    }
    for (let j = 0; j < this.state.chef.length; j++) {
      currentChefId = this.state.chef[j].chefId;
    }
    const saveButton = savedChefIdsArray.includes(currentChefId) || this.state.isSaved
      ? (
        <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">
          <i className="fas fa-check f6f4f2"></i> Saved
        </div>
        )
      : (
        <button type="button" onClick={this.handleClickSave} className="w-100 btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#saveConfModal">
          <i className="far fa-bookmark"></i> Save
        </button>
        );
    return (
      <div className='container'>
        {
          this.state.chef.map(chef => {
            return (
            <div key={chef.username} className="pb-5">
              <div className="text-center text-lg-start mb-5 col-md-6 ms-md-auto me-md-auto">
                <div className="d-lg-flex align-items-lg-center">
                  <img src={chef.photoUrl} className="profile-page-picture shadow" />
                  <div className="mt-4 mb-4 ms-lg-5">
                    <ProfileName name={chef.username} />
                    <div className="d-flex justify-content-center justify-content-lg-start">
                      <StarRating rating={chef.avg} />
                      <p>({chef.avg.slice(0, 3)})</p>
                    </div>
                    <p>{chef.count} reviews</p>
                    <CuisineTypes cuisineType={chef.cuisineType} />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 mt-5 mt-lg-3 mb-5 col-lg-6 me-auto ms-auto">
                <div className="w-50">
                  <button type="button" className="w-100 btn btn-primary" data-bs-toggle="modal" data-bs-target="#reviewModal">
                    Write Review
                  </button>
                </div>
                <div className="w-50">
                  {saveButton}
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="mb-5 col-12 col-lg-6">
                  <DishPictures chefId={chef.chefId} />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="mb-5 col-lg-6">
                  <h1>About</h1>
                  <div className="bg-white shadow p-4 rounded">
                    <p>{chef.bio}</p>
                  </div>
                </div>
              </div>
              <div className="d-lg-flex justify-content-lg-center">
                <div className="col-lg-6">
                  <h1>Reviews</h1>
                  <div className="bg-white shadow p-4 rounded">
                    <Reviews reviews={this.state.reviews} />
                  </div>
                </div>
              </div>
              <ReviewModal handleTextChange={this.handleTextChange} handleStarClick={this.handleStarClick} rating={this.state.rating} username={chef.username} chefId={chef.chefId} handleSubmit={this.handleSubmit} />
              <div className="modal fade" id="confModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalToggleLabel">Success!</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      Your Comment has been Posted
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="saveConfModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalToggleLabel">Success!</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      Chef has been added
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })
        }
      </div>
    );
  }
}

export default ChefProfile;
