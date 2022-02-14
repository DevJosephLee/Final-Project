import React from 'react';
import StarRating from './star-rating';

function Reviews(props) {
  return (
    props.reviews.map(reviews => {
      return (
        <div key={reviews.reviewId} className="review-section mt-3">
          <div className="d-flex align-items-center mb-2">
            <div className="col-4 text-center">
              <img src={reviews.url} className="user-picture shadow" />
            </div>
            <div className="col-8">
              <h3>{reviews.username}</h3>
              <h5>{reviews.createdAt.slice(0, 10)}</h5>
              <StarRating rating={reviews.rating} />
            </div>
          </div>
          <div className="ps-md-5">
            <p>{reviews.content}</p>
          </div>
        </div>
      );
    })
  );
}

// class Reviews extends React.component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       photoUrl: []
//     };
//   }

//   render() {
//     return (
//       props.reviews.map(reviews => {
//         return (
//           <div key={reviews.reviewId} className="review-section mt-3">
//             <div className="d-flex align-items-center mb-2">
//               <div className="col-4 text-center">
//                 <img src={reviews.url} className="user-profile-picture shadow" />
//               </div>
//               <div className="col-8">
//                 <h3>{reviews.username}</h3>
//                 <h5>{reviews.createdAt.slice(0, 10)}</h5>
//                 <StarRating rating={reviews.rating} />
//               </div>
//             </div>
//             <div className="ps-md-5">
//               <p>{reviews.content}</p>
//             </div>
//           </div>
//         );
//       })
//     );
//   }
// }

export default Reviews;
