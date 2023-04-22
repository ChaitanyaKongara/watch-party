import React, { useState, useEffect } from "react";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import ScrollToBottom from 'react-scroll-to-bottom';
import { TextField, Button } from '@mui/material';
import './Chat.css'

function Chat({socket, data, messages, setMessages}) {
  const [newMessage, setNewMessage] = useState('');


  const handleMessageSent = () => {
    console.log('at sent', newMessage, data)
    socket.emit('new_message', {userId: data.userId, userName: data.userName, message: newMessage, roomId: data.roomId, partyType: data.partyType});
    setNewMessage('');
  }
  return (
    <div className="chat">
      <ScrollToBottom className="scroll_to_bottom">
        <MessageList
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={messages}
          /> 
      </ScrollToBottom>
      <div className="input-container">
        <TextField className="text-box" value={newMessage} fullWidth multiline={false} id="outlined-basic" label="Type a message..." variant="outlined" onChange={e => setNewMessage(e.target.value)}/>

        <Button onClick={handleMessageSent} variant="contained">Send</Button>
      </div>
    </div>
  ); 
}

export default Chat;
