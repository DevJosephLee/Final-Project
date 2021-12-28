import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
import ProfilePicture from '../components/profile-picture';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';

export default class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chef: []
    };
  }

  componentDidMount() {
    fetch('/api/chefs/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ chef: data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className='container'>
        {
          this.state.chef.map(chef => {
            return (
              <div key={chef.name} className='mobile-row mobile-text-align-center padding-top-bottom'>
                <ProfilePicture photoUrl={chef.photoUrl} />
                <div className='line-height'>
                  <ProfileName name={chef.name} />
                  <div className="row align-center justify-center">
                    <StarRating rating={chef.avg} />
                    <p className='margin-left'>{chef.count} reviews</p>
                  </div>
                </div>
              </div>
            );
          })
        }
        <DishPictures />
        <Reviews />
      </div>
    );
  }
}
