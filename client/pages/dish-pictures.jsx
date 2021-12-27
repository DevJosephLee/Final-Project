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
      <div>
        {
          this.state.dishes.map(dishes => {
            return (
              <div key={dishes.dishId}>
                <img className='dish-photos' src={dishes.photoUrl} ></img>
                <h3>{dishes.name}</h3>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default DishPictures;
