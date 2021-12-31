import React from 'react';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisines: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/cuisines')
      .then(response => response.json())
      .then(data => {
        this.setState({ cuisines: data });
      })
      .catch(err => console.error(err));
  }

  handleSubmit(event) {
    event.preventDefault();
    // const { cuisineType } = this.props;
    // fetch(`/api/search/:${cuisineType}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     window.location.hash = 'search';
    //   });
  }

  render() {
    return (
      <div className="text-align-center">
        <form onSubmit={this.handleSubmit}>
          <div>
            <p>Please select a cuisine type</p>
            <select className="cuisine-dropdown" name="cuisineList" id="cuisineList">
              {
                this.state.cuisines.map(cuisine => {
                  return (
                    <option key={cuisine.cuisineId} value={cuisine.name}>{cuisine.name}</option>
                  );
                })
              }
            </select>
          </div>
          <a href='#' type='submit'>Search</a>
        </form>
      </div>
    );
  }
}

export default SearchPage;

// { `#search?chefId=${chefId}` }
