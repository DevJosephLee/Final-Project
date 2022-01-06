import React from 'react';

function DeleteConfModal(props) {
  return (
    <div className="row justify-center align-center height-100">
      <div className="modal">
        <div className="text-align-end margin-top-bottom-2">
          <i className="far fa-window-close modal-x-button" onClick={props.closeConfModal}></i>
        </div>
        <div className="text-align-center margin-top">
          <i className="far fa-thumbs-up thumbs-up"></i>
          <h2>Chef has been removed!</h2>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfModal;
