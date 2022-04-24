import React from 'react';
import StarRating from '../components/star-rating';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chefs: [],
      reviews: [],
      photoUrl: [],
      totalChefs: []
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMakeChefProfileClick = this.handleMakeChefProfileClick.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    fetch('/api/userProfile', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(result => {
        const [user] = result;
        this.setState({ photoUrl: user.photoUrl });
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
        const noDummyReview = result.filter(noDummyReview => noDummyReview.content !== null && noDummyReview.rating !== null);
        this.setState({ reviews: noDummyReview });
        // for (let i = 0; i < this.state.reviews.length; i++) {
        //   if (this.state.reviews[i].content === null && this.state.reviews[i].rating === null) {
        //     this.state.reviews.splice(i);
        //   }
        // }
      })
      .catch(err => console.error(err));

    fetch('/api/chefs')
      .then(response => response.json())
      .then(totalChefs => this.setState({ totalChefs }));
  }

  handleDeleteClick(event) {
    const token = window.localStorage.getItem('user-jwt');
    const chefId = Number(event.target.getAttribute('chefId'));
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
          return chefId !== chef.chefId;
        });
        this.setState({ chefs: newChefArray });
      })
      .catch(err => console.error(err));
  }

  handleSubmit(event) {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    const form = new FormData();
    form.append('file-to-upload', this.fileInputRef.current.files[0]);
    fetch('/api/uploads', {
      method: 'POST',
      headers: {
        'X-Access-Token': token
      },
      body: form
    })
      .then(response => response.json())
      .then(result => {
        this.fileInputRef.current.value = null;
        this.setState({ photoUrl: result[0].photoUrl });
      })
      .catch(err => console.error(err));
  }

  handleMakeChefProfileClick() {
    const lastChef = this.state.totalChefs[this.state.totalChefs.length - 1];
    const lastChefId = lastChef.chefId + 1;
    window.location.hash = 'becomeChefBio?chefId=' + lastChefId;
  }

  render() {
    let profilePictureButtonText = 'Add Profile Picture';
    if (this.state.photoUrl !== 'images/testing-image.jpeg') {
      profilePictureButtonText = 'Change Profile Picture';
    }
    return (
      <div className="container pb-5 mt-5">
        <div className="text-center">
          <div className="d-flex justify-content-center">
            <img src={this.state.photoUrl} className="user-profile-picture shadow"/>
          </div>
          <div className="mt-1">
            <button type="button" className="add-profile-picture-button" data-bs-toggle="modal" data-bs-target="#pictureUploadModal">{profilePictureButtonText}</button>
          </div>
          <div className="mt-2">
            <h3>{this.state.username}</h3>
          </div>
        </div>
        <div className="d-flex justify-content-center mb-5">
          <button onClick={this.handleMakeChefProfileClick} className="btn btn-primary">Make chef profile</button>
        </div>
        <div className="container mb-5 col-md-10 col-lg-6">
          <h1>Saved Chefs</h1>
          {
            this.state.chefs.length > 0
              ? (
                  this.state.chefs.map(chef => {
                    return (
                    <div key={chef.chefId} className="container-saved-chefs bg-white p-3 rounded shadow mb-3">
                      <div className="p-1">
                        <div className="d-flex align-items-center">
                          <div className="d-flex justify-content-center col-5">
                            <img className="profile-picture rounded" src={chef.photoUrl} />
                          </div>
                          <div className="col-7">
                            <div className="ms-4">
                              <div className="d-flex align-items-center">
                                <h3 className="saved-chefs-text">{chef.username}</h3>
                              </div>
                              <div className="d-flex">
                                <StarRating rating={chef.avg} />
                                <p>({chef.avg.slice(0, 3)})</p>
                              </div>
                              <p className="">{chef.count} Reviews</p>
                              <p className="saved-chefs-text">{chef.cuisineType}</p>
                              <div className="col-12">
                                <button chefid={chef.chefId} type="button" className="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#deleteChefModal" onClick={this.handleDeleteClick}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )
              : (
                <div className="mt-5">
                  <div className="d-flex justify-content-center">
                    <i className="far fa-folder-open folder"></i>
                  </div>
                  <div className="d-flex justify-content-center">
                    <p>Empty...</p>
                  </div>
                </div>
                )
          }
        </div>
        <div className="container mb-5 col-md-10 col-lg-6">
          <h1>My Reviews</h1>
          {
            this.state.reviews.length > 0
              ? (
                  this.state.reviews.map(review => {
                    return (
                    <div key={review.reviewId} className="container-saved-chefs bg-white p-3 rounded shadow mb-3">
                      <div className="d-flex align-items-center">
                        <div className="d-flex justify-content-center align-items-center col-5">
                          <img src={review.photoUrl} className="profile-picture rounded" />
                        </div>
                        <div className="col-6">
                          <div className="ms-4">
                            <h3>{review.username}</h3>
                            <h5>{review.createdAt.slice(0, 10)}</h5>
                            <StarRating rating={review.rating} />
                            <p className="review-section">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )
              : (
                <div className="mt-5">
                  <div className="d-flex justify-content-center">
                    <i className="far fa-folder-open folder"></i>
                  </div>
                  <div className="d-flex justify-content-center">
                    <p>Empty...</p>
                  </div>
                </div>
                )
          }
        </div>
        <div className="modal fade" id="deleteChefModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel">Success!</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Chef has been deleted
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="pictureUploadModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Profile Picture</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <input type="file" id="photoUpload" name="image" ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" />
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >Upload</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
