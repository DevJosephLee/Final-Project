import React from 'react';

class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 1,
      content: ''
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(event) {
    this.setState({ content: event.target.value });
  }

  handleStarClick() {
    this.setState({ rating: event.target.getAttribute('rating') });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { chefId, userId } = this.props;
    fetch(`/api/review/${chefId}/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json());
  }

  render() {
    const star = Array(5).fill();
    return (
      <div className="row justify-center align-center height-100">
        <div className="modal">
          <div className="row justify-between align-center">
            <h3>{this.props.name}</h3>
            <i className="far fa-window-close modal-x-button" onClick={this.props.closeModal}></i>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="row align-center">
              {
                star.map((_, index) => {
                  index += 1;
                  return (
                    <div key={index}>
                      <i rating={index} className={this.state.rating < index ? 'far fa-star modal-stars orange' : 'fas fa-star modal-stars orange'} onClick={this.handleStarClick}></i>
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
                onChange={this.handleTextChange}
                type="text" />
            </div>
            <div className="height-modal row align-center justify-between">
              <button className="cancel-button" onClick={this.props.closeModal}>Cancel</button>
              <button className="post-button" onClick={this.props.closeModal}>Post Review</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ReviewModal;
