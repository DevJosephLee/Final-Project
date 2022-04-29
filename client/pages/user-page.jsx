import React from 'react';
import StarRating from '../components/star-rating';
import decodeToken from '../lib/decode-token';
class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chefs: [],
      reviews: [],
      photoUrl: [],
      totalChefs: [],
      chefProfCreated: false,
      chefId: null
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMakeChefProfileClick = this.handleMakeChefProfileClick.bind(this);
    this.updateChefProfilePic = this.updateChefProfilePic.bind(this);
    this.goToChefProfile = this.goToChefProfile.bind(this);
    this.clickChefUsername = this.clickChefUsername.bind(this);
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
        for (let i = 0; i < result.length; i++) {
          result[i].count = result[i].count - 1;
        }
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
        const payload = decodeToken(token);
        for (let i = 0; i < result.length; i++) {
          if (result[i].content === null && result[i].rating === null && result[i].userId === payload.userId) {
            this.setState({ chefProfCreated: true });
            this.setState({ chefId: result[i].chefId });
          }
        }
        const noDummyReview = result.filter(noDummyReview => noDummyReview.content !== null && noDummyReview.rating !== null);
        this.setState({ reviews: noDummyReview });
      })
      .catch(err => console.error(err));

    fetch('/api/chefs')
      .then(response => response.json())
      .then(totalChefs => this.setState({ totalChefs }));
  }

  componentWillUnmount() {
    this.setState({ chefId: null });
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

  updateChefProfilePic() {
    if (this.state.chefId !== null) {
      const token = window.localStorage.getItem('user-jwt');
      const form = new FormData();
      form.append('file-to-upload', this.fileInputRef.current.files[0]);
      fetch(`/api/changeChefProfilePhoto/${this.state.chefId}`, {
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
  }

  clickChefUsername(event) {
    window.location.hash = 'chefProfile?chefId=' + event.target.getAttribute('data-chef-id');
  }

  handleMakeChefProfileClick() {
    const lastChef = this.state.totalChefs[this.state.totalChefs.length - 1];
    const lastChefId = lastChef.chefId + 1;
    window.location.hash = 'becomeChefBio?chefId=' + lastChefId;
  }

  goToChefProfile() {
    window.location.hash = 'chefProfile?chefId=' + this.state.chefId;
  }

  render() {
    const createChefProfileButton = this.state.chefProfCreated
      ? <button onClick={this.goToChefProfile} className="btn btn-primary">Go to my chef profile</button>
      : <button onClick={this.handleMakeChefProfileClick} className="btn btn-primary">Create chef profile</button>;
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
          {createChefProfileButton}
        </div>
        <div className="container mb-5 col-md-10 col-lg-6">
          <h1>Saved Chefs</h1>
          {
            this.state.chefs.length > 0
              ? (
                  this.state.chefs.map(chef => {
                    if (chef.avg !== null && chef.count !== 0) {
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
                                    <button className="saved-chefs-button" onClick={this.clickChefUsername} data-chef-id={chef.chefId}>{chef.username}</button>
                                  </div>
                                  <div className="d-flex">
                                    <StarRating rating={chef.avg} />
                                    <p>({chef.avg.slice(0, 3)})</p>
                                  </div>
                                  <p>{chef.count} Review(s)</p>
                                  <p>{chef.cuisineType}</p>
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
                    } else {
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
                                    <h3>{chef.username}</h3>
                                  </div>
                                  <div className="d-flex">
                                    <p>No Reviews</p>
                                  </div>
                                  <p>{chef.cuisineType}</p>
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
                    }
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
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.updateChefProfilePic}>Upload</button>
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
