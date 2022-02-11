import React from 'react';
import StarRating from '../components/star-rating';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      chefs: [],
      reviews: [],
      photoUrl: '',
      confModalOpened: false
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.closeConfModal = this.closeConfModal.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
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

    fetch('/api/userProfile/images', {
      headers: {
        'X-Access-Token': token
      }
    })
      .then(response => response.json())
      .then(result => {
        this.setState({ photoUrl: result });
      })
      .catch(err => console.error(err));
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
    this.setState({ confModalOpened: true });
  }

  closeConfModal() {
    this.setState({ confModalOpened: false });
  }

  handlePhotoUpload(event) {
    // const token = window.localStorage.getItem('user-jwt');
    // console.log(event.target);
    // console.log('success');
    // console.log(event.target.files[0]);
    this.setState({ photoUrl: event.target.files[0].name });
  }

  render() {
    return (
      <div className="container pb-5 mt-5">
        <div className="text-center mb-5">
          {
            this.state.photoUrl === ''
              ? <i className="far fa-grin user-icon"></i>
              : <img src={this.state.photoUrl} />
          }

          <div className="mt-2">
            <h3>{this.state.username}</h3>
          </div>
        </div>
        <form>
          <label htmlFor="photoUpload">Add Photo</label>
          <input type="file" id="photoUpload" onChange={this.handlePhotoUpload}/>
        </form>
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
                                <h3 className="saved-chefs-text">{chef.name}</h3>
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
                            <h3>{review.name}</h3>
                            <h5>{review.createdAt.slice(0, 10)}</h5>
                            <StarRating rating={review.rating} />
                            <p>{review.content}</p>
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
      </div>
    );
  }
}

export default UserPage;
