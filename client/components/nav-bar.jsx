import React from 'react';

class NavBar extends React.Component {
  render() {
    const { user } = this.props;
    const removeProfileIcon = user !== null
      ? <i className="fas fa-user-alt profile-icon" onClick={this.props.goToProfile}></i>
      : '';
    return (
      <div className="nav-bar">
        <div className="container">
          <div className="row justify-between width-adj padding-top-bottom-2">
            <a href="#search" className="logo-text">ChefConnect</a>
            {removeProfileIcon}
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
