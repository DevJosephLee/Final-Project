import React from 'react';
import parseRoute from '../lib/parse-route.js';
class MakeChefProfilePageBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      bio: '',
      route: parseRoute(window.location.hash),
      photoUrl: [],
      chefId: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
  }

  componentDidMount() {
    const { route } = this.state;
    const chefId = route.params.get('chefId');
    this.setState({ chefId });
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
  }

  handleBioChange(event) {
    this.setState({ bio: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/becomeChef/${this.state.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(newChef => {
        newChef.bio = this.state.bio;
        newChef.username = this.state.username;
        newChef.photoUrl = this.state.photoUrl;
      })
      .catch(err => {
        console.error(err);
      });

    window.location.hash = 'becomeChefCuisine?chefId=' + this.state.chefId;
  }

  render() {
    const nextButton = this.state.bio.length > 0
      ? <button type="submit" className="btn btn-primary w-100" >Next</button>
      : <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">Next</div>;
    return (
      <div className="container pb-5">
        <div className="container">
          <p>Create Chef Profile Bio Page</p>
          <div className="text-center">
            <div className="d-flex justify-content-center mt-2">
              <img src={this.state.photoUrl} className="user-profile-picture shadow" />
            </div>
            <div className="mt-2">
              <h3>{this.state.username}</h3>
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <h5><u>Step 1</u></h5><p>Tell me about yourself:</p>
            </div>
            <div className="text-center mb-3">
              <textarea required className="chef-reg-textarea" onChange={this.handleBioChange} placeholder="Hello, I am Joe and I love to cook..."></textarea>
            </div>
            <div className="text-center mb-3">
              {nextButton}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MakeChefProfilePageBio;
