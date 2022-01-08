import React from 'react';

function StarRating(props) {
  const stars = Array(5).fill().map((_, index) => {
    if (props.rating > index) return <i key={index} className="fas fa-star star" />;
    return <i key={index} className="far fa-star star" />;
  });
  return (
    <div>
      {stars}
    </div>
  );
}

export default StarRating;
