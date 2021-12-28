import React from 'react';

function StarRating(props) {
  if (props.rating === 5) {
    return (
      <div>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
      </div>
    );
  } else if (props.rating === 4) {
    return (
      <div>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="far fa-star"></i>
      </div>
    );
  } else if (props.rating === 3) {
    return (
      <div>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
      </div>
    );
  } else if (props.rating === 2) {
    return (
      <div>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
      </div>
    );
  } else {
    return (
      <div>
        <i className="fas fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
        <i className="far fa-star"></i>
      </div>
    );
  }
}

export default StarRating;
