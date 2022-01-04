import React from 'react';

function ReviewConfModal(props) {
  return (
    <div className="row justify-center align-center height-100">
      <div className="modal">

          <div className="text-align-end margin-top-bottom-2">
            <i className="far fa-window-close modal-x-button" onClick={props.closeConfModal}></i>
          </div>
          <div className="text-align-center margin-top">
            <i className="far fa-thumbs-up thumbs-up"></i>
            <h2>Nice Review!</h2>
            <h3>Your review has been posted</h3>
          </div>

      </div>
    </div>
  );
}

export default ReviewConfModal;
