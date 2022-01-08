// import React from 'react';

// class DishPictures extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dishes: []
//     };
//   }

//   componentDidMount() {
//     fetch(`/api/dishes/${this.props.chefId}`)
//       .then(response => response.json())
//       .then(data => {
//         this.setState({ dishes: data });
//       })
//       .catch(err => console.error(err));
//   }

//   render() {
//     return (
//       <div className='width-adj margin-bottom'>
//         <h1>Dishes</h1>
//         <div className='row flex-wrap text-align-center justify-between'>
//           {
//             this.state.dishes.map(dishes => {
//               return (
//                 <div className='width-150 text-align-center' key={dishes.dishId}>
//                   <img className='dish-pictures' src={dishes.photoUrl} ></img>
//                   <h4>{dishes.name}</h4>
//                 </div>
//               );
//             })
//           }
//         </div>
//       </div>
//     );
//   }
// }

// export default DishPictures;

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
    }, 3000);
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
        <div className="container bg-white shadow p-4 rounded">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-chevron-left" onClick={this.handleLeftClick}></i>
              {this.state.dishes.map((dishes, index) => {
                return (
                  <div key={dishes.dishId}>
                    <img className={`dish-photos ${this.state.currentImageIndex === index ? 'd-block' : 'd-none'}`} key={dishes.name} src={dishes.photoUrl} />
                  </div>
                );
              })}
              <i className="fas fa-chevron-right" onClick={this.handleRightClick}></i>
            </div>
            <div>
              {this.state.dishes.map((dishes, index) => {
                return (
                  <button onClick={this.handleButtonClick} className={`${index} ${this.state.currentImageIndex === index ? 'black' : 'white'}`} key={dishes.name} ></button>
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
