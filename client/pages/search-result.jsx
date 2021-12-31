import React from 'react';
import StarRating from '../components/star-rating';

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
      <div className="container height-100">
        <div className="width-adj">
          <p>search results for {this.props.selectedCuisine}</p>
          {
            this.state.chefs.map(chef => {
              return (
                <div className="row border-bottom padding-top-bottom-2" key={chef.chefId}>
                  <img className="profile-picture margin-right" src={chef.photoUrl} />
                  <div>
                    <h2>{chef.name}</h2>
                    <div className="row align-center">
                      <StarRating rating={chef.avg} />
                      <p className='margin-left'>{chef.count} reviews</p>
                    </div>
                    <div className="margin-top">
                      <button className="info-button">INFO</button>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default SearchResultPage;
