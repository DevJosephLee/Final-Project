import React from 'react';

class DishPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: []
    };
  }

  componentDidMount() {
    fetch('/api/dishes/2')
      .then(response => response.json())
      .then(data => {
        this.setState({ dishes: data });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className='width-adj margin-bottom'>
        <h1>Dishes</h1>
        <div className='row flex-wrap text-align-center justify-between'>
          {
            this.state.dishes.map(dishes => {
              return (
                <div className='width-150 text-align-center' key={dishes.dishId}>
                  <img className='dish-pictures' src={dishes.photoUrl} ></img>
                  <h4>{dishes.name}</h4>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default DishPictures;
