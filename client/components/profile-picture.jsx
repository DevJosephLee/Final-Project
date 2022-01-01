import React from 'react';

function ProfilePicture(props) {
  return (
    <img className='mobile-margin-right profile-picture' src={props.photoUrl}></img>
  );
}

export default ProfilePicture;
