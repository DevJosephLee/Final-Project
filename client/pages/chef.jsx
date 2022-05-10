import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';
import CuisineTypes from '../components/cuisine-types';
import ReviewModal from '../components/review-modal';
import decodeToken from '../lib/decode-token';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import parseRoute from '../lib/parse-route';
import ChatRoom from '../components/chat-room';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');
class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chef: [],
      reviews: [],
      savedChefs: [],
      rating: 1,
      count: 0,
      avg: 0,
      route: parseRoute(window.location.hash),
      photoUrl: 'images/testing-image.jpeg',
      isSaved: false,
      noComment: true,
      chatContainerOpened: false,
      roomId: '',
      hideMessagesContainer: false,
      chatRoomCreated: false,
      liveMessageUsername: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.updateAvgCount = this.updateAvgCount.bind(this);
    this.clickLiveMessageButton = this.clickLiveMessageButton.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    const payload = decodeToken(token);
    this.setState({ liveMessageUsername: payload.username });
    const { route } = this.state;
    const chefId = route.params.get('chefId');
    fetch(`/api/chefs/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        const [modifyData] = data;
        this.setState({ count: modifyData.count - 1 });
        this.setState({ avg: modifyData.avg });
        modifyData.count = modifyData.count - 1;
        this.setState({ chef: [modifyData] });
      })
      .catch(err => {
        console.error(err);
      });

    fetch(`/api/reviews/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        const noDummyReview = data.filter(noDummyReview => noDummyReview.content !== null && noDummyReview.rating !== null);
        this.setState({ reviews: noDummyReview });
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

    fetch('/api/getChatRoom/', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].chefId === Number(chefId)) {
            this.setState({ roomId: data[i].roomId });
            this.setState({ chatRoomCreated: true });
          }
        }
      })
      .catch(err => console.error(err));

    fetch('/api/isUserChef/', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        const [chef] = data;
        if (chef !== undefined && Number(chef.chefId) === Number(chefId)) {
          this.setState({ hideMessagesContainer: true });
        }
      })
      .catch(err => console.error(err));
  }

  clickLiveMessageButton() {
    const { route } = this.state;
    const token = window.localStorage.getItem('user-jwt');
    if (!this.state.chatContainerOpened) {
      this.setState({ chatContainerOpened: true });
    } else {
      this.setState({ chatContainerOpened: false });
    }
    const chefId = route.params.get('chefId');
    if (!this.state.chatRoomCreated) {
      fetch(`/api/createChatRoom/${chefId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ roomId: data.roomId });
          socket.emit('join_room', data.roomId);
        })
        .catch(err => {
          console.error(err);
        });
    }
    socket.emit('join_room', this.state.roomId);
    this.setState({ chatRoomCreated: true });
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
    this.setState({ noComment: false });
    for (let i = 0; i < this.state.reviews.length; i++) {
      if (this.state.reviews[i].content === null && this.state.reviews[i].rating === null) {
        this.state.reviews.splice(i);
      }
    }
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

  updateAvgCount() {
    fetch(`/api/chefs/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        const [modifyData] = data;
        this.setState({ count: modifyData.count - 1 });
        this.setState({ avg: modifyData.avg });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const messageSectionClass = this.state.hideMessagesContainer
      ? 'hidden'
      : 'position-fixed bottom-0 end-0 w-50';
    const chatRoomContainerClass = this.state.chatContainerOpened
      ? 'view'
      : 'hidden';
    const reviewView = this.state.noComment
      ? (
        <div className = "mt-5">
          <div className = "d-flex justify-content-center">
            <i className = "far fa-folder-open folder"></i>
          </div >
          <div className="d-flex justify-content-center">
            <p>No Reviews...</p>
          </div>
        </div >
        )
      : (
        <div className="bg-white shadow p-4 rounded">
          <Reviews reviews={this.state.reviews} />
        </div>
        );
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
      <div className='container position-relative'>
        {
          this.state.chef.map(chef => {
            if (chef.avg !== null && chef.count !== 0) {
              return (
                <div key={chef.username} className="pb-5">
                  <div className="text-center text-lg-start mb-5 col-md-6 ms-md-auto me-md-auto">
                    <div className="d-lg-flex align-items-lg-center">
                      <img src={chef.photoUrl} className="profile-page-picture shadow" />
                      <div className="mt-4 mb-4 ms-lg-5">
                        <ProfileName name={chef.username} />
                        <>
                          <div className="d-flex justify-content-center justify-content-lg-start">
                            <StarRating rating={this.state.avg} />
                            <p>({this.state.avg.slice(0, 3)})</p>
                          </div>
                          <p>{this.state.count} reviews</p>
                        </>
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
                    <div className="mb-5 col-12 col-lg-6">
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
                  <ReviewModal handleTextChange={this.handleTextChange} handleStarClick={this.handleStarClick} rating={this.state.rating} username={chef.username} chefId={chef.chefId} handleSubmit={this.handleSubmit} updateAvgCount={this.updateAvgCount}/>
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
            } else {
              return (
                <div key={chef.username} className="pb-5">
                  <div className="text-center text-lg-start mb-5 col-md-6 ms-md-auto me-md-auto">
                    <div className="d-lg-flex align-items-lg-center">
                      <img src={chef.photoUrl} className="profile-page-picture shadow" />
                      <div className="mt-4 mb-4 ms-lg-5">
                        <ProfileName name={chef.username} />
                        <div className="d-flex justify-content-center justify-content-lg-start">
                          <p>No Reviews</p>
                        </div>
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
                    <div className="mb-5 col-12 col-lg-6">
                      <h1>About</h1>
                      <div className="bg-white shadow p-4 rounded">
                        <p>{chef.bio}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-lg-flex justify-content-lg-center">
                    <div className="col-lg-6">
                      <h1>Reviews</h1>
                      {reviewView}
                    </div>
                  </div>
                  <ReviewModal handleTextChange={this.handleTextChange} handleStarClick={this.handleStarClick} rating={this.state.rating} username={chef.username} chefId={chef.chefId} handleSubmit={this.handleSubmit} updateAvgCount={this.updateAvgCount} />
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
            }
          })
        }
        <div className={messageSectionClass}>
          <div className={chatRoomContainerClass}>
            <ChatRoom roomId={Number(this.state.roomId)} username={this.state.liveMessageUsername} socket={socket}></ChatRoom>
          </div>
          <button className="btn btn-primary w-100" onClick={this.clickLiveMessageButton}><FontAwesomeIcon icon={faMessage} />&nbsp;&nbsp;Message</button>
        </div>
      </div>
    );
  }
}

export default ChefProfile;
