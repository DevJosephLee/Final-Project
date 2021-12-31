import React from 'react';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisines: [],
      selectedCuisine: 'Select Cuisine'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/cuisines')
      .then(response => response.json())
      .then(cuisines => this.setState({ cuisines }));
  }

  handleChange(event) {
    this.setState({ selectedCuisine: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    window.location.hash = 'searchResults?cuisine=' + this.state.selectedCuisine;
  }

  render() {
    return (
      <div className="text-align-center height-100">
        <h1 className="margin-top-bottom">Welcome!</h1>
        <form className="line-height-2" onSubmit={this.handleSubmit} >
          <div>
            <p>Please select a cuisine type</p>
            <select className="cuisine-dropdown" name="cuisineList" id="cuisineList" value={this.state.selectedCuisine} onChange={this.handleChange}>
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
          <button className="submit-button" type="submit">Search</button>
        </form>
      </div>
    );
  }
}

export default SearchPage;
