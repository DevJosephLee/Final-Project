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
      <div className="text-align-center">
        <h1>Hello</h1>
        <form onSubmit={this.handleSubmit} >
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
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }
}

export default SearchPage;

// { `#search?chefId=${chefId}` }
/* <a href={`#search?cuisineType=${selectedCuisine}`} type='submit'>Search</a> */
//   <div key={chef.chefId}>
//     <h1>{chef.avg}</h1>
//     <h1>{chef.count}</h1>
//     <h1>{chef.name}</h1>
//     <img src={chef.photoUrl} />
//   </div>

// const { selectedCuisine } = this.state;
// fetch(`/api/search/${selectedCuisine}`)
//   .then(response => response.json())
//   .then(result => {
//     this.setState({ chefs: result });
//     window.location.hash = 'searchResult';
//     console.log(this.state.chefs);
//   })
//   .catch(err => console.error(err));
