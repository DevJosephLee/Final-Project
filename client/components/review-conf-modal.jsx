import React from 'react';

function ReviewConfModal(props) {
  return (
    // <div className="row justify-center align-center height-100">
    //   <div className="modal">
    //     <div className="text-align-end margin-top-bottom-2">
    //       <i className="far fa-window-close modal-x-button" onClick={props.closeConfModal}></i>
    //     </div>
    //     <div className="text-align-center margin-top">
    //       <i className="far fa-thumbs-up thumbs-up"></i>
    //       <h2>Nice Review!</h2>
    //       <h3>Your review has been posted</h3>
    //     </div>
    //   </div>
    // </div>
    <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalToggleLabel">Modal 1</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Show a second modal and hide this one with the button below.
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Open second modal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewConfModal;
