import React from 'react';
import decodeToken from '../lib/decode-token';
import ScrollToBottom from 'react-scroll-to-bottom';
import parseRoute from '../lib/parse-route';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: '',
      username: '',
      route: parseRoute(window.location.hash),
      messageList: [],
      tempMessageId: 0,
      roomId: 0
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { route } = this.state;
    const chefId = route.params.get('chefId');
    const token = window.localStorage.getItem('user-jwt');
    this.setState({ username: decodeToken(token).username });
    this.props.socket.on('receive_message', data => {
      this.setState({ messageList: [].concat(this.state.messageList, data) });
    });

    if (route.path === 'chefProfile') {
      fetch('/api/getChatRoom/', {
        headers: {
          'X-Access-Token': token
        }
      })
        .then(response => response.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].chefId === Number(chefId)) {
              fetch(`/api/messages/${data[i].roomId}`)
                .then(response => response.json())
                .then(messages => {
                  this.setState({ messageList: messages });
                })
                .catch(err => console.error(err));
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { route } = this.state;
    if (route.path !== 'userProfile') {
      return;
    }
    if (this.props.roomId !== prevProps.roomId) {
      fetch(`/api/messages/${this.props.roomId}`)
        .then(response => response.json())
        .then(messages => {
          this.setState({ messageList: messages });
        })
        .catch(err => console.error(err));
    }
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
        messageId: `#${this.state.tempMessageId}`
      };
      this.props.socket.emit('send_message', messageData);
      this.setState({ messageList: [].concat(this.state.messageList, messageData) });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: this.props.roomId,
        author: this.props.username,
        message: this.state.currentMessage
      })
    })
      .then(response => response.json())
      .catch(err => {
        console.error(err);
      });
    this.setState({ currentMessage: '' });
    this.setState({ tempMessageId: this.state.tempMessageId + 1 });
  }

  render() {
    return (
      <div>
        <ScrollToBottom className="chat-room-container">
          {
            this.state.messageList.map(messageContent => {
              return (
                <div key={messageContent.messageId}>
                  <div className={messageContent.author === this.state.username ? 'd-flex justify-content-end' : 'd-flex justify-content-start'}>
                    <div className={messageContent.author === this.state.username ? 'message-content bg-primary' : 'message-content bg-success'}>
                      <p>{messageContent.message}</p>
                    </div>
                  </div>
                  <div className={messageContent.author === this.state.username ? 'd-flex justify-content-end fst-italic' : 'd-flex justify-content-start fst-italic'}>
                    <p>{messageContent.author}</p>
                  </div>
                </div>
              );
            })
          }
        </ScrollToBottom>
        <div className="send-message-container">
          <form onSubmit={this.handleSubmit} className="w-100">
            <input
              className="send-message-input w-75"
              value={this.state.currentMessage}
              type="text"
              onChange={this.handleMessageChange}
              >
            </input>
            <button type="submit" className="btn btn-primary w-25" onClick={this.sendMessage}>Send</button>
          </form>
        </div>
      </div>
    );
  }
}
// onKeyPress = { event => {
//   event.key === 'Enter' && this.sendMessage();
// }}

export default ChatRoom;
