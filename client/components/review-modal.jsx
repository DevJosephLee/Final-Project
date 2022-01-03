import React from 'react';
// import StarRating from './star-rating';
// import ReviewStar from './review-star';

class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 1,
      content: ''
    };
    this.handleChange = this.handleTextChange.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(event) {
    const { value } = event.target;
    // this.setState = { rating, content: value };
    this.setState({ content: value });
  }

  handleStarClick() {
    this.setState({ rating: event.target.getAttribute('rating') });
  }

  handleSubmit(event) {
    event.preventDefault();
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
                      <i rating={index} className={this.state.rating < index ? 'far fa-star modal-stars' : 'fas fa-star modal-stars'} onClick={this.handleStarClick}></i>
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
              <button className="post-button">Post Review</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ReviewModal;
