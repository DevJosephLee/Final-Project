import React from 'react';
import StarRating from './star-rating';

function Reviews(props) {
  return (
    props.reviews.map(reviews => {
      return (
        <div key={reviews.reviewId}>
          <div className='row align-center'>
            <div className='row user-icon-container align-center justify-center margin-right'>
              <i className='far fa-grin user-icon'></i>
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
  );
}

export default Reviews;
