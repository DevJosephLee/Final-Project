import React from 'react';

function ReviewModal(props) {
  // const star = Array(5).fill();
  // return (
  //   <div className="row justify-center align-center height-100">
  //     <div className="modal">
  //       <div className="row justify-between align-center">
  //         <h3>{props.name}</h3>
  //         <i className="far fa-window-close modal-x-button" onClick={props.closeModal}></i>
  //       </div>
  //       <form onSubmit={props.handleSubmit}>
  //         <div className="row align-center">
  //           {
  //             star.map((_, index) => {
  //               index += 1;
  //               return (
  //                 <div key={index}>
  //                   <i rating={index} className={props.rating < index ? 'far fa-star modal-stars orange' : 'fas fa-star modal-stars orange'} onClick={props.handleStarClick}></i>
  //                 </div>
  //               );
  //             })
  //           }
  //           <p className="margin-left">select your rating</p>
  //         </div>
  //         <div>
  //           <textarea
  //             className="review-input"
  //             required
  //             autoFocus
  //             onChange={props.handleTextChange}
  //             type="text" />
  //         </div>
  //         <div className="height-modal row align-center justify-between">
  //           <button className="cancel-button" onClick={props.closeModal}>Cancel</button>
  //           <button className="post-button" onClick={props.openConfModal}>Post Review</button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
  const star = Array(5).fill();
  return (
    <div className="modal fade" id="myModal">
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
              <div className="col-12">
                <textarea
                  className="w-100 review-modal p-2"
                  required
                  autoFocus
                  onChange={props.handleTextChange}
                  type="text" />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;

/* <div className="height-modal row align-center justify-between">
                <button className="cancel-button" onClick={props.closeModal}>Cancel</button>
                <button className="post-button" onClick={props.openConfModal}>Post Review</button>
              </div> */
