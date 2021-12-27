import React from 'react';

class DishPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: []
    };
  }

  componentDidMount() {
    fetch('/api/dishes/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ dishes: data });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className='background-color width-400'>
        <h1 className='column-adj'>Dishes</h1>
        <div className='row flex-wrap text-align-center justify-between'>
          {
            this.state.dishes.map(dishes => {
              return (
                <div className='width' key={dishes.dishId}>
                  <img className='dish-pictures' src={dishes.photoUrl} ></img>
                  <h3>{dishes.name}</h3>
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
