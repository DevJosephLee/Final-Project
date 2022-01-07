import React from 'react';
import StarRating from '../components/star-rating';

class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chefs: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/search/${this.props.selectedCuisine}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ chefs: data });
      });
  }

  handleClick(event) {
    const chefid = event.target.getAttribute('chefid');
    window.location.hash = 'chefProfile?chefId=' + chefid;
  }

  render() {
    return (
      <div className="container">
        <div className="">
          <p>search results for {this.props.selectedCuisine}</p>
          {
            this.state.chefs.map(chef => {
              return (
                <div className="" key={chef.chefId}>
                  <img className="" src={chef.photoUrl} />
                  <div>
                    <h2>{chef.name}</h2>
                    <div className="">
                      <StarRating rating={chef.avg} />
                      <p className="">{chef.count} reviews</p>
                    </div>
                    <div className="">
                      <a chefid={chef.chefId} className="" onClick={this.handleClick}>INFO</a>
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
