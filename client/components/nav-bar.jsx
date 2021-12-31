import React from 'react';

function NavBar(props) {
  return (
    <div className="nav-bar">
      <div className="container">
        <div className="row justify-between width-adj padding-top-bottom-2">
          <a href="#search" className="logo-text">ChefConnect</a>
          <i className="fas fa-user-alt profile-icon"></i>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
