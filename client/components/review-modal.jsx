import React from 'react';

function ReviewModal(props) {
  const star = Array(5).fill();
  return (
    <div className="modal fade" id="reviewModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{props.name}</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={props.handleSubmit}>
              <div className="d-flex gap-2">
                {
                  star.map((_, index) => {
                    index += 1;
                    return (
                      <div key={index}>
                        <i rating={index} className={props.rating < index ? 'far fa-star modal-stars star-modal' : 'fas fa-star modal-stars star-modal'} onClick={props.handleStarClick}></i>
                      </div>
                    );
                  })
                }
                <p className="margin-left">select your rating</p>
              </div>
              <div className="col-12 mb-3">
                <textarea
                  className="w-100 review-modal p-2"
                  required
                  autoFocus
                  onChange={props.handleTextChange}
                  type="text" />
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="w-25">
                  <button type="button" className="btn btn-danger w-100" data-bs-dismiss="modal">Close</button>
                </div>
                <div className="w-25">
                  <button type="submit" className="btn btn-primary w-100" data-bs-dismiss="modal" data-bs-target="#confModal" data-bs-toggle="modal">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
