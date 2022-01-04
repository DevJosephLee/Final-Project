import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
import ProfilePicture from '../components/profile-picture';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';
import CuisineTypes from '../components/cuisine-types';
import ReviewModal from '../components/review-modal';
import decodeToken from '../lib/decode-token';
import ReviewConfModal from '../components/review-conf-modal';

class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chef: [],
      reviews: [],
      rating: 1,
      modalOpened: false,
      confModalOpened: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openConfModal = this.openConfModal.bind(this);
    this.closeConfModal = this.closeConfModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
  }

  componentDidMount() {
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
  }

  openModal() {
    if (!this.state.modalOpened) {
      this.setState({ modalOpened: true });
    }
  }

  closeModal() {
    if (this.state.modalOpened) {
      this.setState({ modalOpened: false });
    }
  }

  openConfModal() {
    this.setState({ modalOpened: false, confModalOpened: true });
  }

  closeConfModal() {
    this.setState({ confModalOpened: false });
  }

  handleTextChange(event) {
    this.setState({ content: event.target.value });
  }

  handleStarClick() {
    this.setState({ rating: event.target.getAttribute('rating') });
  }

  handleSubmit(newReview) {
    event.preventDefault();
    const token = window.localStorage.getItem('final-project-jwt');
    const payload = decodeToken(token);
    const userId = payload.userId;
    fetch(`/api/review/${this.props.chefId}/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(newReview => {
        this.setState({ reviews: [].concat(this.state.reviews, newReview) });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const token = window.localStorage.getItem('final-project-jwt');
    const payload = decodeToken(token);
    const modalClass = this.state.modalOpened
      ? 'show'
      : 'hidden';
    const ConfModalClass = this.state.confModalOpened
      ? 'show'
      : 'hidden';
    return (
      <div className='container'>
        {
          this.state.chef.map(chef => {
            return (
              <div key={chef.name} className='padding-top-bottom'>
                <div className="mobile-row mobile-text-align-center margin-bottom">
                  <ProfilePicture chefId={chef.chefId} photoUrl={chef.photoUrl} />
                  <div className="margin-left">
                    <ProfileName name={chef.name} />
                    <div className="row mobile-justify-center align-center">
                      <StarRating rating={chef.avg} />
                      <p className='margin-left'>{chef.count} reviews</p>
                    </div>
                    <CuisineTypes cuisineType={chef.cuisineType} />
                    <div className="width-adj margin-bottom">
                      <button className="review-button" onClick={this.openModal}>Write a Review</button>
                    </div>
                  </div>
                </div>
                <div>
                  <DishPictures chefId={chef.chefId} />
                </div>
                <div className="width-adj line-height-3 margin-bottom">
                  <h1>About</h1>
                  <p>{chef.bio}</p>
                </div>
                <div className='width-adj padding-bottom'>
                  <h1>Reviews</h1>
                  <Reviews reviews={this.state.reviews} />
                </div>
                <div className={`height-100 overlay ${modalClass}`} >
                  <ReviewModal handleTextChange={this.handleTextChange} handleStarClick={this.handleStarClick} rating={this.state.rating} name={chef.name} openConfModal={this.openConfModal} closeModal={this.closeModal} chefId={chef.chefId} userId={payload.userId} handleSubmit={this.handleSubmit} />
                </div>
                <div className={`height-100 overlay ${ConfModalClass}`}>
                  <ReviewConfModal closeConfModal={this.closeConfModal} />
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
