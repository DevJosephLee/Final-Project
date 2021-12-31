import React from 'react';
class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chefs: []
    };
  }

  componentDidMount() {
    fetch(`/api/search/${this.props.selectedCuisine}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ chefs: data });
      });
  }

  render() {
    return (
      this.state.chefs.map(chef => {
        return (
          <div key={chef.chefId}>
            <h1>{chef.name}</h1>
          </div>
        );
      })
    );

  }
}

export default SearchResultPage;
