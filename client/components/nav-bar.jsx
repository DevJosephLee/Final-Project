import React from 'react';

class NavBar extends React.Component {
  render() {
    const { goToProfile, user, route, handleSignOut } = this.props;
    let navBarClass = 'navbar';
    if (route === 'sign-in' || route === 'sign-up') {
      navBarClass = 'd-none';
    }
    return (
      <div className="container">
        <nav className={`${navBarClass} navbar-expand-lg navbar-dark bg-f7f4f2`}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#search"><img src="images/navbarlogo.png" className="w-50" /></a>
            <div className="btn-group">
              <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-bars"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a href='#search' className="dropdown-item" type="button">Go To Home Page</a></li>
                <li><a href={user !== null ? `#userProfile?userId=${user.userId}` : ''} className="dropdown-item" type="button" onClick={goToProfile}>Go To Profile</a></li>
                <li><button className="dropdown-item text-danger" onClick={handleSignOut} type="button">Sign Out</button></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBar;
