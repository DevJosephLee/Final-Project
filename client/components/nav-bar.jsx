import React from 'react';

class NavBar extends React.Component {
  render() {
    const { goToProfile, user, route, handleSignOut } = this.props;
    let profileIcon = user !== null
      ? <a href={'#userProfile?userId=' + user.userId} className="fas fa-user-alt profile-icon" onClick={goToProfile}></a>
      : '';
    if (route === 'userProfile') {
      profileIcon = <button className="signout-button" onClick={handleSignOut}>Sign out</button>;
    }
    let navBarClass = 'nav-bar';
    if (route === 'sign-in' || route === 'sign-up') {
      navBarClass = 'hidden';
    }
    return (
      <div className={navBarClass}>
        <div className="container">
          <div className="row justify-between align-center width-adj padding-top-bottom-2">
            {/* <a href="#search" className="logo-text">ChefConnect</a> */}
            {profileIcon}
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
