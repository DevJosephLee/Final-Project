import React from 'react';
import StarRating from './star-rating';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    };
  }

  componentDidMount() {
    fetch('api/reviews/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ reviews: data });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className='width-adj padding-bottom'>
        <h1>Reviews</h1>
        {
          this.state.reviews.map(reviews => {
            return (
              <div key={reviews.reviewId}>
                <div className='row align-center'>
                  <div className='row user-icon-container align-center justify-center margin-right'>
                    <i className='far fa-grin'></i>
                  </div>
                  <div>
                    <h3>{reviews.username}</h3>
                    <h3>{reviews.createdAt.slice(0, 10)}</h3>
                    <StarRating rating={reviews.rating} />
                  </div>
                </div>
                <p className='review-content'>{reviews.content}</p>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Reviews;
