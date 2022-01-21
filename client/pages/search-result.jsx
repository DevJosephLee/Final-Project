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
      <div className="container pb-5">
        <div className="container">
          <p>Search results for {this.props.selectedCuisine}</p>
          {
          this.state.chefs.length > 0
            ? (
              <div className="d-lg-flex flex-wrap">
                {
                  this.state.chefs.map(chef => {
                    return (
                      <div key={chef.chefId} className="text-lg-center search-result-cards">
                        <div className="bg-white p-3 rounded shadow mt-4 d-flex d-lg-block align-items-center m-lg-4" key={chef.chefId}>
                          <div className="col-5 col-lg-12">
                            <img className="rounded w-100 profile-picture" src={chef.photoUrl} />
                          </div>
                          <div className="ms-4 ms-lg-0 mt-lg-5">
                            <h2 className="mb-lg-3">{chef.name}</h2>
                            <div className="text-lg-center">
                              <div className="d-flex justify-content-lg-center">
                                <StarRating rating={chef.avg} />
                                <p>({chef.avg.slice(0, 3)})</p>
                              </div>
                              <p>{chef.count} reviews</p>
                            </div>
                            <div className="col-7 col-lg-12 mt-lg-5">
                              <a chefid={chef.chefId} type="button" className="btn btn-primary w-100" onClick={this.handleClick}>INFO</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
              )
            : <div>
                <div className="d-flex justify-content-center mt-5">
                  <i className="fas fa-not-equal not-equal"></i>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <h3>Sorry, we couldn&apos;t find any chefs...</h3>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default SearchResultPage;
