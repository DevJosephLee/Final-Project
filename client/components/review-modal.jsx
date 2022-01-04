import React from 'react';

function ReviewModal(props) {
  const star = Array(5).fill();
  return (
    <div className="row justify-center align-center height-100">
      <div className="modal">
        <div className="row justify-between align-center">
          <h3>{props.name}</h3>
          <i className="far fa-window-close modal-x-button" onClick={props.closeModal}></i>
        </div>
        <form onSubmit={props.handleSubmit}>
          <div className="row align-center">
            {
              star.map((_, index) => {
                index += 1;
                return (
                  <div key={index}>
                    <i rating={index} className={props.rating < index ? 'far fa-star modal-stars orange' : 'fas fa-star modal-stars orange'} onClick={props.handleStarClick}></i>
                  </div>
                );
              })
            }
            <p>select your rating</p>
          </div>
          <div>
            <textarea
              className="review-input"
              required
              autoFocus
              onChange={props.handleTextChange}
              type="text" />
          </div>
          <div className="height-modal row align-center justify-between">
            <button className="cancel-button" onClick={props.closeModal}>Cancel</button>
            <button className="post-button" onClick={props.openConfModal}>Post Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
