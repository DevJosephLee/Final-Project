import React from 'react';

class DishPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
      currentImageIndex: 0
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
    const dishPhotoUrls = [];
    const dishNames = [];
    for (let i = 0; i < this.state.dishes.length; i++) {
      dishPhotoUrls.push(this.state.dishes[i].photoUrl);
      dishNames.push(this.state.dishes[i].name);
    }
    return (
      <div>
        <h1>Dishes</h1>
        <div className="container bg-white shadow p-4 rounded dish-picture-container">
          <div className="text-center">
            <div id="carouselIndicators" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img className="d-block w-100 dish-photos" src={dishPhotoUrls[0]} alt={dishNames[0]} />
                  <div className="mb-5">
                    <p>{dishNames[0]}</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100 dish-photos" src={dishPhotoUrls[1]} alt={dishNames[1]} />
                  <div className="mb-5">
                    <p>{dishNames[1]}</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100 dish-photos" src={dishPhotoUrls[2]} alt={dishNames[2]} />
                  <div className="mb-5">
                    <p>{dishNames[2]}</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100 dish-photos" src={dishPhotoUrls[3]} alt={dishNames[3]} />
                  <div className="mb-5">
                    <p>{dishNames[3]}</p>
                  </div>
                </div>
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
                <li data-target="#carouselIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselIndicators" data-slide-to="1"></li>
                <li data-target="#carouselIndicators" data-slide-to="2"></li>
                <li data-target="#carouselIndicators" data-slide-to="3"></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DishPictures;

/* <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-chevron-left arrow-icon-left" onClick={this.handleLeftClick}></i>
              {this.state.dishes.map((dishes, index) => {
                return (
                  <div key={dishes.dishId}>
                    <img className={`dish-photos ${this.state.currentImageIndex === index ? 'd-block' : 'd-none'} border border-light`} src={dishes.photoUrl} />
                    <div>
                      <p className={this.state.currentImageIndex === index ? 'd-block' : 'd-none'}>{dishes.name}</p>
                    </div>
                  </div>
                );
              })}
              <i className="fas fa-chevron-right arrow-icon-right" onClick={this.handleRightClick}></i>
            </div>
            <div className="gap-2 d-flex justify-content-center">
              {this.state.dishes.map((dishes, index) => {
                return (
                  <div key={index}>
                    <button onClick={this.handleButtonClick} className={`${index} ${this.state.currentImageIndex === index ? 'carousel-buttons-black' : 'carousel-buttons'} `} key={dishes.name} ></button>
                  </div>
                );
              })}
            </div> */

// componentWillUnmount() {
//   clearInterval(this.intervalId);
// }

// handleLeftClick() {
//   this.setState({ currentImageIndex: this.state.currentImageIndex - 1 });
//   if (this.state.currentImageIndex === 0) {
//     this.setState({ currentImageIndex: this.state.dishes.length - 1 });
//   }
// }

// handleRightClick() {
//   this.setState({ currentImageIndex: this.state.currentImageIndex + 1 });
//   if (this.state.currentImageIndex === this.state.dishes.length - 1) {
//     this.setState({ currentImageIndex: 0 });
//   }
// }

// handleButtonClick(event) {
//   this.setState({ currentImageIndex: Number(event.target.className[0]) });
// }

// this.intervalId = setInterval(() => {
//   if (this.state.currentImageIndex === this.state.dishes.length - 1) {
//     this.setState({ currentImageIndex: -1 });
//   }
//   this.setState({ currentImageIndex: this.state.currentImageIndex + 1 });
// }, 5000);

// this.handleLeftClick = this.handleLeftClick.bind(this);
// this.handleRightClick = this.handleRightClick.bind(this);
// this.handleButtonClick = this.handleButtonClick.bind(this);
