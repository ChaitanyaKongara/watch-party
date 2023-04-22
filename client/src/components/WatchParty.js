import React,{ useEffect, useState } from "react";
import { useLocation, redirect } from "react-router-dom";
import Chat from "./Chat.js";
import VideoPlayer from './VideoPlayer.js';
import BasicTabs from "./Tab.js";
import "./WatchParty.css";

// import MemberInfo from "./MemberInfo.js";
const { io } = require("socket.io-client");

function WatchParty() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  console.log(location.state)
  var socket = io(`${process.env.REACT_APP_PROD_SERVER_IP}`, {
    withCredentials: true,
  });
  useEffect(() => {
    socket.connect();
    console.log('sending join room msg');
    socket.emit('join_room', location.state);
    return (() => socket.close());
  },[]);
  
  useEffect(() => {
    socket.on('new_message', (message_data) => {
      console.log('got new message', message_data)
      setMessages(prevMessages => [...prevMessages, {position:(message_data.userId === location.state.userId ? 'right' : 'left'), type:'text', title: message_data.userName, text: message_data.message}]); 
      console.log(messages);
    });

    socket.on('new_video_message', (message_data) => {
      
    });
  }, [socket]);

  if (!location.state) {
    return redirect('/');
  }
  return (
    <div className="watch_party">
      <VideoPlayer socket={socket} data={location.state} messages={messages} setMessages={setMessages}/>
      <BasicTabs socket={socket} data={location.state} messages={messages} setMessages={setMessages}/>
    </div> 
  );
}

export default WatchParty;
