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
      <div className="container vh-100">
        <div className="mt-5 mb-5 text-center">
          <div className="p-5">
            <h1 className="mb-5">Welcome!</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="col-10 col-lg-6 bg-white p-4 rounded shadow mt-4">
              <p className="mb-5 fs-4 pt-5">Please Select a Cuisine Type</p>
              <form onSubmit={this.handleSubmit} >
                <div className="d-flex justify-content-center">
                  <div className="col-12">
                    <select className="w-100 p-2 search-dropdown" name="cuisineList" id="cuisineList" value={this.state.selectedCuisine} onChange={this.handleChange}>
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
                </div>
                <div className="d-flex justify-content-center">
                  <div className="col-lg-2 col-sm-3">
                    <button className="w-100 mt-4 mb-4 btn btn-primary" type="submit">SEARCH</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPage;
