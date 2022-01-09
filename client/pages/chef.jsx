import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
// import ProfilePicture from '../components/profile-picture';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';
import CuisineTypes from '../components/cuisine-types';
import ReviewModal from '../components/review-modal';
import decodeToken from '../lib/decode-token';
import ReviewConfModal from '../components/review-conf-modal';
import SaveConfModal from '../components/save-conf-modal';

class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chef: [],
      reviews: [],
      rating: 1,
      modalOpened: false,
      confModalOpened: false,
      saveConfModalOpened: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openConfModal = this.openConfModal.bind(this);
    this.closeConfModal = this.closeConfModal.bind(this);
    this.closeSaveConfModal = this.closeSaveConfModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
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

  closeSaveConfModal() {
    this.setState({ saveConfModalOpened: false });
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
        this.setState({ reviews: [].concat(this.state.reviews, newReview) });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleClickSave() {
    const token = window.localStorage.getItem('final-project-jwt');
    fetch(`/api/userProfile/${this.props.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      }
    });
    this.setState({ saveConfModalOpened: true });
  }

  render() {
    const token = window.localStorage.getItem('final-project-jwt');
    const payload = decodeToken(token);
    const modalClass = this.state.modalOpened
      ? 'show'
      : 'hidden';
    const confModalClass = this.state.confModalOpened
      ? 'show'
      : 'hidden';
    const saveConfModalClass = this.state.saveConfModalOpened
      ? 'show'
      : 'hidden';
    return (
      <div className='container'>
        {
          this.state.chef.map(chef => {
            return (
              <div key={chef.name} className="container">
                <div className="text-center mb-5">
                  <img src={chef.photoUrl} className="profile-page-picture shadow" />
                  <div className="mt-4 mb-4">
                    <ProfileName name={chef.name} />
                    <div className="d-flex justify-content-center">
                      <StarRating rating={chef.avg} />
                      <p>({chef.avg.slice(0, 3)})</p>
                    </div>
                    <p>{chef.count} reviews</p>
                    <CuisineTypes cuisineType={chef.cuisineType} />
                    <div className="d-flex align-items-center gap-2 mt-5">
                      <div className="col-6">
                        {/* <button type="button" className="btn btn-primary" onClick={this.openModal}>Comment</button> */}
                        <button type="button" className="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#myModal">
                          Comment
                        </button>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center justify-content-center save-button bg-white w-100 border border-dark">
                          <i className="far fa-bookmark m-3"></i>
                          <button type="button" className="btn btn-white" onClick={this.handleClickSave}>Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  <div className="mb-5">
                    <DishPictures chefId={chef.chefId} />
                  </div>
                <div className="container mb-5">
                  <h1>About</h1>
                  <div className="bg-white shadow p-4 rounded">
                    <p>{chef.bio}</p>
                  </div>
                </div>
                <div className="container mb-5">
                  <h1>Comments</h1>
                  <div className="bg-white shadow p-4 rounded">
                    <Reviews reviews={this.state.reviews} />
                  </div>
                </div>
                <div className={`height-100 overlay ${modalClass}`} >
                  <ReviewModal handleTextChange={this.handleTextChange} handleStarClick={this.handleStarClick} rating={this.state.rating} name={chef.name} openConfModal={this.openConfModal} closeModal={this.closeModal} chefId={chef.chefId} userId={payload.userId} handleSubmit={this.handleSubmit} />
                </div>
                <div className={`height-100 overlay ${confModalClass}`}>
                  <ReviewConfModal closeConfModal={this.closeConfModal} />
                </div>
                <div className={`height-100 overlay ${saveConfModalClass}`}>
                  <SaveConfModal closeSaveConfModal={this.closeSaveConfModal} />
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
