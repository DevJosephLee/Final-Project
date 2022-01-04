import React from 'react';

function SaveConfModal(props) {
  return (
    <div className="row justify-center align-center height-100">
      <div className="modal">
        <div className="text-align-end margin-top-bottom-2">
          <i className="far fa-window-close modal-x-button" onClick={props.closeSaveConfModal}></i>
        </div>
        <div className="text-align-center margin-top">
          <i className="far fa-check-square checkmark"></i>
          <h2 className="margin-top">Chef has been added to your favorites!</h2>
        </div>
      </div>
    </div>
  );
}

export default SaveConfModal;
