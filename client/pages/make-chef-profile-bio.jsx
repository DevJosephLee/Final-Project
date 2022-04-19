import React from 'react';

class MakeChefProfilePageBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      bio: '',
      photoUrl: [],
      totalChefs: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
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

    fetch('/api/chefs')
      .then(response => response.json())
      .then(totalChefs => this.setState({ totalChefs }));
  }

  handleBioChange(event) {
    this.setState({ bio: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/becomeChef/${this.props.chefId}`, {
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

    const lastChef = this.state.totalChefs[this.state.totalChefs.length - 1];
    const lastChefId = lastChef.chefId + 1;
    window.location.hash = 'becomeChefCuisine?chefId=' + lastChefId;
  }

  render() {
    return (
      <div className="container pb-5">
        <div className="container">
          <p>Make Chef Profile Bio Page</p>
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
              <button type="submit" className="btn btn-primary w-100" >Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MakeChefProfilePageBio;
