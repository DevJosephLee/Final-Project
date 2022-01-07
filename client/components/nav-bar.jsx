import React from 'react';

class NavBar extends React.Component {
  render() {
    const { goToProfile, user, route, handleSignOut } = this.props;
    // const goToProfileClass = user !== null
    // ? <a href={'#userProfile?userId=' + user.userId} className="fas fa-user-alt profile-icon" onClick={goToProfile}></a>
    // : '';
    // ? `#userProfile?userId=${user.userId}`
    // : '';
    // if (user !== null) {
    //   const goToProfileClass = `#userProfile?userId=${user.userId}`;
    // }
    // if (route === 'userProfile') {
    //   profileIcon = <button className="signout-button" onClick={handleSignOut}>Sign out</button>;
    // }
    let navBarClass = 'navbar';
    if (route === 'sign-in' || route === 'sign-up') {
      navBarClass = 'd-none';
    }
    return (
      // <nav className={`${navBarClass} navbar-expand-lg navbar-dark bg-f7f4f2`}>
      //   <div className="container-fluid">
      //     <div className="">
      //       <a className="navbar-brand" href="#search"><img src="images/navbarlogo.png" className="w-50" /></a>
      //       <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
      //       <span className="navbar-toggler-icon"></span>
      //     </button>
      //     <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
      //       <ul className="navbar-nav">
      //         <li className="nav-item dropdown">
      //           <a className="nav-link dropdown-toggle text-dark" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      //             Dropdown
      //           </a>
      //           <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
      //             <li><a className="dropdown-item" href="#">Go To Profile</a></li>
      //             <li><a className="dropdown-item" href="#sign-in">Sign Out</a></li>
      //           </ul>
      //         </li>
      //       </ul>
      //     </div>
      //     </div>
      //   </div>
      // </nav>
      <nav className={`${navBarClass} navbar-expand-lg navbar-dark bg-f7f4f2`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#search"><img src="images/navbarlogo.png" className="w-50" /></a>
          <div className="btn-group">
            <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="navbar-toggler-icon" ></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a href={user !== null ? `#userProfile?userId=${user.userId}` : ''} className="dropdown-item" type="button" onClick={goToProfile}>Go To Profile</a></li>
              <li><button className="dropdown-item text-danger" onClick={handleSignOut} type="button">Sign Out</button></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;

// <div className={navBarClass}>
//   <div className="container">
//     <div className="">
//       <a href="#search"><img src="images/nav-bar-logo.png"></img></a>
//       {profileIcon}
//     </div>
//   </div>
// </div>
