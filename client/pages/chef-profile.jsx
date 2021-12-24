import React from 'react';

export default function ChefProfile(props) {
  return (
    <div>
      <img src={props.photoUrl}></img>
      <p>{props.name}</p>
    </div>
  );
}
