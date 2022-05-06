import React from 'react';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: ''
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('receive_message', data => {
      // eslint-disable-next-line no-console
      console.log(data);
    });
  }

  handleMessageChange(event) {
    this.setState({ currentMessage: event.target.value });
  }

  sendMessage(props) {
    if (this.state.currentMessage !== '') {
      const messageData = {
        roomId: this.props.roomId,
        author: this.props.username,
        message: this.state.currentMessage,
        // time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
        time: new Date()
      };
      this.props.socket.emit('send_message', messageData);
    }
  }

  render() {
    return (
      <div>
        <div className='chat-header'>
          <p>Live Chat</p>
        </div>
        <div className='chat-body'>

        </div>
        <div className='chat-footer'>
          <input type='text' onChange={this.handleMessageChange}/>
          <button onClick={this.sendMessage}>&#9658;</button>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
