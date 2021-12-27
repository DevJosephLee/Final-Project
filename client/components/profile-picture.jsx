import React from 'react';

function ProfilePicture(props) {
  return (
    <img className='mobile-margin-right' src={props.photoUrl}></img>
  );
}

export default ProfilePicture;
