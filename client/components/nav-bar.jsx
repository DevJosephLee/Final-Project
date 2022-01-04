import React from 'react';

class NavBar extends React.Component {
  render() {
    const { goToProfile, user, route, handleSignOut } = this.props;
    let profileIcon = user !== null
      ? <i className="fas fa-user-alt profile-icon" onClick={goToProfile}></i>
      : '';
    if (route === 'userProfile') {
      profileIcon = <button className="signout-button" onClick={handleSignOut}>Sign out</button>;
    }
    return (
      <div className="nav-bar">
        <div className="container">
          <div className="row justify-between align-center width-adj padding-top-bottom-2">
            <a href="#search" className="logo-text">ChefConnect</a>
            {profileIcon}
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
