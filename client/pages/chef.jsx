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
      modalOpened: false,
      confModalOpened: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openConfModal = this.openConfModal.bind(this);
    this.closeConfModal = this.closeConfModal.bind(this);
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
                <div className="text-align-center margin-bottom">
                  <ProfilePicture chefId={chef.chefId} photoUrl={chef.photoUrl} />
                  <div className='line-height'>
                    <ProfileName name={chef.name} />
                    <div className="row align-center justify-center">
                      <StarRating rating={chef.avg} />
                      <p className='margin-left'>{chef.count} reviews</p>
                    </div>
                    <CuisineTypes cuisineType={chef.cuisineType} />
                  </div>
                </div>
                <div className="margin-bottom">
                  <div className="width-adj">
                    <button className="review-button" onClick={this.openModal}>Write a Review</button>
                  </div>
                </div>
                <div>
                  <DishPictures chefId={chef.chefId} />
                  <Reviews chefId={chef.chefId} />
                </div>
                <div className={`height-100 overlay ${modalClass}`} >
                  <ReviewModal name={chef.name} openConfModal={this.openConfModal} closeModal={this.closeModal} chefId={chef.chefId} userId={payload.userId} />
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
