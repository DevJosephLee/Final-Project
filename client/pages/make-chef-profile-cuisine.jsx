import React from 'react';
import parseRoute from '../lib/parse-route.js';
class MakeChefProfilePageCuisine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      photoUrl: [],
      route: parseRoute(window.location.hash),
      cuisines: [],
      cuisineId: null,
      chefId: null
    };
    this.handleCuisineChange = this.handleCuisineChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    fetch('/api/cuisines')
      .then(response => response.json())
      .then(cuisines => this.setState({ cuisines }));
  }

  handleCuisineChange(event) {
    const cuisines = this.state.cuisines;
    for (let i = 0; i < cuisines.length; i++) {
      if (cuisines[i].name === event.target.value) {
        this.setState({ cuisineId: i + 1 });
      }
    }
  }

  handleSubmit() {
    event.preventDefault();

    const token = window.localStorage.getItem('user-jwt');
    fetch(`/api/becomeChef/cuisines/${this.state.chefId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(newChef => {
        newChef.cuisineId = this.state.cuisineId;
      })
      .catch(err => {
        console.error(err);
      });

    window.location.hash = 'becomeChefDishes?chefId=' + this.state.chefId;
  }

  render() {
    const nextButton = this.state.cuisineId !== null
      ? <button type="submit" className="btn btn-primary w-100" >Next</button>
      : <div className="d-flex justify-content-center align-items-center w-100 gap-2 saved-button rounded">Next</div>;
    return (
      <div className="container pb-5">
        <div className="container">
          <p>Create Chef Profile Cuisine Page</p>
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
              <h5><u>Step 2</u></h5><p>Select your cuisine specialty:</p>
            </div>
            <div className="text-center mb-3">
              <select className="w-100" onChange={this.handleCuisineChange}>
                <option>Select Cuisine</option>
                {
                  this.state.cuisines.map(cuisine => {
                    return (
                      <option key={cuisine.cuisineId} value={cuisine.name}>{cuisine.name}</option>
                    );
                  })
                }
              </select>
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

export default MakeChefProfilePageCuisine;
