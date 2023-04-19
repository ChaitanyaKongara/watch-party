import React,{ useEffect } from "react";
import { useLocation } from "react-router-dom";
const { io } = require("socket.io-client");

function WatchParty() {
  var socket = io(`${process.env.REACT_APP_SERVER_IP}`, {
    withCredentials: true,
  });
  const location = useLocation();
  useEffect(() => {
    socket.on('message', (msg) => console.log('messe', msg));
    console.log(location.state);
    return (() => socket.close())
  }, [socket]);
  useEffect(() => {
    socket.connect()
    console.log('sending join room msg');
    socket.emit('join_room', location.state);
  },[]);
  return <h1>Party</h1>
}

export default WatchParty;
