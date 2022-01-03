import React from 'react';

class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: '',
      content: ''
    };
  }

  render() {
    return (
      <div className="row justify-center align-center height-100">
        <div className="modal">
          <div className="row justify-between">
            <h4>{this.props.name}</h4>
            <i className="far fa-window-close modal-x-button"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewModal;
