import React from 'react';
import decodeToken from '../lib/decode-token';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: '',
      messageList: [],
      username: ''
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    this.setState({ username: decodeToken(token).username });
    this.props.socket.on('receive_message', data => {
      this.setState({ messageList: [].concat(this.state.messageList, data) });
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
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
      };
      this.props.socket.emit('send_message', messageData);
      this.setState({ messageList: [].concat(this.state.messageList, messageData) });
    }
  }

  render() {
    return (
      <div>
        <div className="chat-room-container">
          {
            this.state.messageList.map(messageContent => {
              return (
                <div key={messageContent.time}>
                  <div
                  className={messageContent.author === this.state.username ? 'd-flex justify-content-end' : 'd-flex justify-content-start'}
                  >
                    <div
                    className={messageContent.author === this.state.username ? 'message-content bg-primary' : 'message-content bg-success'}
                    >
                      <p className='fs-4'>{messageContent.message}</p>
                    </div>
                  </div>
                  <div
                    className={messageContent.author === this.state.username ? 'd-flex justify-content-end fst-italic' : 'd-flex justify-content-start fst-italic'}
                  >
                    <p>{messageContent.time}&nbsp;{messageContent.author}</p>
                    <p></p>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="send-message-container">
          <input className="w-75" type="text" onChange={this.handleMessageChange}></input>
          <button className="btn btn-primary w-25" onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
