import React from 'react';
import ProfilePicture from './pages/profile-picture';
import ProfileName from './pages/profile-name';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chef: []
    };
  }

  componentDidMount() {
    fetch('/api/chefs/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ chef: data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        {
          this.state.chef.map(chef => {
            return (
              <div key={chef.name} className='mobile-row text-align-center height-500 padding'>
                <ProfilePicture photoUrl={chef.photoUrl} />
                <ProfileName name={chef.name} />
              </div>
            );
          })
        }
      </div>
    );
  }
}
