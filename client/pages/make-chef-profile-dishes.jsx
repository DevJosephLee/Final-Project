// handleDishOneNameChange(event) {
//   this.setState({ dishNameOne: event.target.value });
// }

// this.handleDishImageOneSubmit = this.handleDishImageOneSubmit.bind(this);

// handleDishImageOneSubmit(event) {
//   event.preventDefault();
//   const token = window.localStorage.getItem('user-jwt');
//   const form = new FormData();
//   const lastChef = this.state.totalChefs[this.state.totalChefs.length - 1];
//   const lastChefId = lastChef.chefId;
//   form.append('file-to-upload', this.fileInputRef.current.files[0]);
//   fetch(`/api/becomeChef/dishes/${lastChefId}`, {
//     method: 'POST',
//     headers: {
//       'X-Access-Token': token
//     },
//     body: form
//   })
//     .then(response => response.json())
//     .then(result => {
//       this.fileInputRef.current.value = null;
//       console.log(result);
//       // this.setState({ dishImageOne: result[0].dishImageOne });
//     })
//     .catch(err => console.error(err));
//   // this.setState({ dishImageOne: event.target. });
// }

// <div className="mb-3">
//   <div className="text-center chef-reg-image-container">
//     <img src={this.state.dishImageOne === '' ? 'images/default-image.png' : this.state.dishImageOne} className="default-image" />
//     {/* <input type="file" onChange={this.handleDishImageOneSubmit}></input> */}
//   </div>
//   <div className="text-center">
//     <button type="button" className="add-profile-picture-button" data-bs-toggle="modal" data-bs-target="#dishPhotoUploadModalOne">add dish photo</button>
//   </div>
//   <div className="text-center">
//     <input text="text" placeholder="dish name"></input>
//   </div>
//   {/* <div className="text-center chef-reg-image-container">
//               <label>
//                 <img src="images/default-image.png" className="default-image"></img>
//                 <input type="file"></input>
//                 <input text="text" placeholder="dish name"></input>
//               </label>
//             </div> */}
// </div>

// {/* <div className="d-flex mb-3">
//             <div className="text-center chef-reg-image-container">
//               <label>
//                 <img src="images/default-image.png" className="default-image"></img>
//                 <input type="file"></input>
//                 <input text="text" placeholder="dish name"></input>
//               </label>
//             </div>
//             <div className="text-center chef-reg-image-container">
//               <label>
//                 <img src="images/default-image.png" className="default-image"></img>
//                 <input type="file"></input>
//                 <input text="text" placeholder="dish name"></input>
//               </label>
//             </div>
//           </div> */}

// { /* <div className="modal fade" id="dishPhotoUploadModalOne" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
//   <div className="modal-dialog modal-dialog-centered">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h5 className="modal-title" id="exampleModalLabel">Add Dish Photo</h5>
//         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <form onSubmit={this.handleDishImageOneSubmit}>
//         <div className="modal-body">
//           <input type="file" id="photoUpload" name="image" ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" />
//         </div>
//         <div className="modal-footer d-flex justify-content-between">
//           <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//           <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >Upload</button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div> */ }
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';

class MakeChefProfilePageDishes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      name: '',
      photoUrl: [],
      dishId: null,
      dishPhotoUrl: 'images/default-image.png',
      chefDishes: [],
      numOfDishesUploads: 0,
      dishNameSubmitted: false
    };
    this.handleDishPhotoSubmit = this.handleDishPhotoSubmit.bind(this);
    this.fileInputRef = React.createRef();
    this.handleDishNameChange = this.handleDishNameChange.bind(this);
    this.handleDishNameSubmit = this.handleDishNameSubmit.bind(this);
    this.clickFinishButton = this.clickFinishButton.bind(this);
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

    // fetch(`/api/becomeChef/dishes/${this.props.chefId}`, {
    //   headers: {
    //     'X-Access-Token': token
    //   }
    // })
    //   .then(response => response.json())
    //   .then(result => {
    //     this.setState({ chefDishes: result });
    //   })
    //   .catch(err => console.error(err));
  }

  handleDishNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleDishPhotoSubmit(event) {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    const form = new FormData();
    form.append('file-to-upload', this.fileInputRef.current.files[0]);
    fetch(`/api/becomeChef/dishPhoto/${this.props.chefId}`, {
      method: 'POST',
      headers: {
        'X-Access-Token': token
      },
      body: form
    })
      .then(response => response.json())
      .then(newChef => {
        this.fileInputRef.current.value = null;
        this.setState({ dishPhotoUrl: newChef.photoUrl });
        this.setState({ dishId: newChef.dishId });
      })
      .catch(err => console.error(err));
  }

  handleDishNameSubmit(event) {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/becomeChef/dishName/${this.props.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(newChef => {
        newChef.dishId = this.state.dishId;
        newChef.name = this.state.name;
      })
      .catch(err => {
        console.error(err);
      });

    this.setState({ dishNameSubmitted: true });
    this.setState({ dishPhotoUrl: 'images/default-image.png' });
    this.setState({ name: '' });
    this.setState({ dishNameSubmitted: false });
    const dishPhotoNameInput = document.getElementById('dishPhotoNameInput');
    dishPhotoNameInput.value = '';
    this.setState({ numOfDishesUploads: this.state.numOfDishesUploads + 1 });
  }

  // componentDidUpdate() {
  //   const token = window.localStorage.getItem('user-jwt');
  //   fetch(`/api/becomeChef/dishes/${this.props.chefId}`, {
  //     headers: {
  //       'X-Access-Token': token
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(result => {
  //       this.setState({ chefDishes: result });
  //     })
  //     .catch(err => console.error(err));
  // }

  clickFinishButton(newReview) {
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
      // .then(newReview => {
    // newReview.content = 'test;
    // newReview.rating = this.state.rating;
    // console.log(newReview);
      // })
      .catch(err => {
        console.error(err);
      });
    window.location.hash = 'chefProfile?chefId=' + this.props.chefId;
  }

  render() {
    const addDishPhotoClass = this.state.dishPhotoUrl === 'images/default-image.png'
      ? 'add-profile-picture-button'
      : 'hidden';
    const dishPhotoTextSubmitClass = this.state.name === ''
      ? 'hidden'
      : 'btn btn-primary w-50';
    const dishPhotoTextInputClass = this.state.dishPhotoUrl === 'images/default-image.png'
      ? 'hidden'
      : 'block';
    const hideOnDishNameSubmit = this.state.dishNameSubmitted
      ? 'hidden'
      : 'block';
    const dishNameTextClass = this.state.dishNameSubmitted
      ? 'mb-3'
      : 'hidden';
    const dishUploadNotifierClassOne = this.state.numOfDishesUploads > 0
      ? 'green'
      : 'red';
    const dishUploadNotifierClassTwo = this.state.numOfDishesUploads > 1
      ? 'green'
      : 'red';
    const dishUploadNotifierClassThree = this.state.numOfDishesUploads > 2
      ? 'green'
      : 'red';
    const dishUploadNotifierClassFour = this.state.numOfDishesUploads > 3
      ? 'green'
      : 'red';
    const finishButtonClass = this.state.numOfDishesUploads === 4
      ? (
        <button type="submit" className="btn btn-primary w-100" onClick={this.clickFinishButton}>Finish</button>
        )
      : (
        <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">Finish</div>
        );
    return (
      <div className="container pb-5">
        <div className="container">
          <p>Make Chef Profile Dishes Page</p>
          <div className="text-center">
            <div className="d-flex justify-content-center mt-2">
              <img src={this.state.photoUrl} className="user-profile-picture shadow" />
            </div>
            <div className="mt-2">
              <h3>{this.state.username}</h3>
            </div>
          </div>
          <div>
            <h5><u>Step 3</u></h5><p>Choose your dish photos:</p>
          </div>
          <div className="d-flex">
            <div className="mb-3 col-6 text-center">
              <img src={this.state.dishPhotoUrl} className="default-image"></img>
              <div className="text-center mb-3">
                <button type="button" className={addDishPhotoClass} data-bs-toggle="modal" data-bs-target="#dishPhotoUploadModal">Add dish photo</button>
              </div>
              <div className={hideOnDishNameSubmit}>
                <div className="mb-3">
                  <input className={dishPhotoTextInputClass} id="dishPhotoNameInput" type="text" onChange={this.handleDishNameChange} placeholder="dish name"></input>
                </div>
                <form onSubmit={this.handleDishNameSubmit}>
                  <div className="mb-3">
                    <button type="submit" className={dishPhotoTextSubmitClass}>Submit</button>
                  </div>
                </form>
              </div>
              <div className={dishNameTextClass}>
                <h5>{this.state.name}</h5>
              </div>
            </div>
            <div className="col-6 text-center">
              <p className={dishUploadNotifierClassOne}>Dish #1 Uploaded&nbsp;<FontAwesomeIcon icon={this.state.numOfDishesUploads > 0 ? faCheck : faX} /></p>
              <p className={dishUploadNotifierClassTwo}>Dish #2 Uploaded&nbsp;<FontAwesomeIcon icon={this.state.numOfDishesUploads > 1 ? faCheck : faX} /></p>
              <p className={dishUploadNotifierClassThree}>Dish #3 Uploaded&nbsp;<FontAwesomeIcon icon={this.state.numOfDishesUploads > 2 ? faCheck : faX} /></p>
              <p className={dishUploadNotifierClassFour}>Dish #4 Uploaded&nbsp;<FontAwesomeIcon icon={this.state.numOfDishesUploads > 3 ? faCheck : faX} /></p>
            </div>
          </div>
          <div className="text-center mb-3">
            {finishButtonClass}
          </div>
          <div className="modal fade" id="dishPhotoUploadModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Add Profile Picture</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={this.handleDishPhotoSubmit}>
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
      </div>
    );
  }
}

export default MakeChefProfilePageDishes;
