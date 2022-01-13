import React from 'react';

class DishPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
      currentImageIndex: 0
    };
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/dishes/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ dishes: data });
      })
      .catch(err => console.error(err));

    this.intervalId = setInterval(() => {
      if (this.state.currentImageIndex === this.state.dishes.length - 1) {
        this.setState({ currentImageIndex: -1 });
      }
      this.setState({ currentImageIndex: this.state.currentImageIndex + 1 });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleLeftClick() {
    this.setState({ currentImageIndex: this.state.currentImageIndex - 1 });
    if (this.state.currentImageIndex === 0) {
      this.setState({ currentImageIndex: this.state.dishes.length - 1 });
    }
  }

  handleRightClick() {
    this.setState({ currentImageIndex: this.state.currentImageIndex + 1 });
    if (this.state.currentImageIndex === this.state.dishes.length - 1) {
      this.setState({ currentImageIndex: 0 });
    }
  }

  handleButtonClick(event) {
    this.setState({ currentImageIndex: Number(event.target.className[0]) });
  }

  render() {
    return (
      <div>
        <h1>Dishes</h1>
        <div className="container bg-white shadow p-4 rounded dish-picture-container">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DishPictures;
