import React from 'react';

function StarRating(props) {
  const stars = Array(5).fill().map((_, index) => {
    if (props.rating > index) return <i key={index} className="fas fa-star orange" />;
    return <i key={index} className="far fa-star orange" />;
  });
  return (
    <div>
      {stars}
    </div>
  );
}

export default StarRating;
