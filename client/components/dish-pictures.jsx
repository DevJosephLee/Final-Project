import React from 'react';

class DishPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: []
    };
  }

  componentDidMount() {
    fetch(`/api/dishes/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ dishes: data });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>Dishes</h1>
        <div className="container bg-white shadow p-4 rounded dish-picture-container">
          <div className="text-center">
            <div id="carouselIndicators" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                {
                  this.state.dishes.map((dish, i) => {
                    return (
                      <div className={i === 0 ? 'carousel-item active' : 'carousel-item'} key={dish.dishId}>
                        <img className="d-block w-100 dish-photos" src={dish.photoUrl} alt={dish.name} />
                        <div className="mb-5">
                          <p>{dish.name}</p>
                        </div>
                      </div>
                    );
                  })
                }

              </div>
              <a className="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
              <ol className="carousel-indicators gap-2">
                {
                  this.state.dishes.map((dish, i) => {
                    return (
                      <li data-target="#carouselIndicators" data-slide-to={i} className={i === 0 ? 'active' : ''} key={dish.dishId}></li>
                    );
                  })
                }
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DishPictures;
