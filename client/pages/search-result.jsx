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
          <p>Search results for {this.props.selectedCuisine}</p>
          {
            this.state.chefs.map(chef => {
              return (
                <div className="bg-white p-3 rounded shadow mt-4 d-flex align-items-center" key={chef.chefId}>
                  <div className="col-5">
                    <img className="rounded w-100 profile-picture" src={chef.photoUrl} />
                  </div>
                  <div className="ms-4">
                    <h2>{chef.name}</h2>
                    <div className="">
                      <div className="d-flex">
                        <StarRating rating={chef.avg} />
                        <p>({chef.avg.slice(0, 3)})</p>
                      </div>

                      <p className="">{chef.count} reviews</p>
                    </div>
                    <div className="col-7">
                      <a chefid={chef.chefId} type="button" className="btn btn-primary w-100" onClick={this.handleClick}>INFO</a>
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
