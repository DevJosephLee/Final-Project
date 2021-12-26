import React from 'react';

function ProfilePicture(props) {
  return (
    <img className='profile-picture' src={props.photoUrl}></img>
  );
}

export default ProfilePicture;
