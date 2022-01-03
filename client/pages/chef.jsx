import React from 'react';
import DishPictures from '../components/dish-pictures';
import ProfileName from '../components/profile-name';
import ProfilePicture from '../components/profile-picture';
import Reviews from '../components/reviews';
import StarRating from '../components/star-rating';
import CuisineTypes from '../components/cuisine-types';
import ReviewButton from '../components/review-button';

class ChefProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chef: []
    };
    this.clickReviewButton = this.clickReviewButton.bind(this);
  }

  componentDidMount() {
    fetch(`/api/chefs/${this.props.chefId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ chef: data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  clickReviewButton(event) {

  }

  render() {
    return (
      <div className='container'>
        {
          this.state.chef.map(chef => {
            return (
              <div key={chef.name} className='padding-top-bottom'>
                <div className="text-align-center margin-bottom">
                  <ProfilePicture chefId={chef.chefId} photoUrl={chef.photoUrl} />
                  <div className='line-height'>
                    <ProfileName name={chef.name} />
                    <div className="row align-center justify-center">
                      <StarRating rating={chef.avg} />
                      <p className='margin-left'>{chef.count} reviews</p>
                    </div>
                    <CuisineTypes cuisineType={chef.cuisineType} />
                  </div>
                </div>
                <div className="margin-bottom">
                  <ReviewButton onClick={this.clickReviewButton} />
                </div>
                <div>
                  <DishPictures chefId={chef.chefId}/>
                  <Reviews chefId={chef.chefId} />
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default ChefProfile;
