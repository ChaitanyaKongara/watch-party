import React, { useState, useRef, useEffect } from 'react'
import { findDOMNode } from 'react-dom'

import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import { TextField, Button } from '@mui/material';

function VideoPlayer ({socket, data, messages, setMessages}) {
  const [state, setState] = useState({url: '', error: false});
  const [url2, setUrl2] = useState('');
  const [playerProps, setPlayerProps] = useState({playing: false, gotAMessage: false});
  // const [playing, setPlaying] = useState(false);
  const [playBackRate, setPlayBackRate] = useState(1);
  // const [lastTimeStamp, setTimeStamp] = useState(-5);
  var playerRef = useRef();
  console.log('reredering', playerProps)
  const loadUrl = () => {
    socket.emit('new_url', {...data, url: url2});
    setState({url: url2, error: false });
  }
  useEffect(() => {
    socket.on('new_url', (message_data) => {
      console.log('got new url', message_data, data.userId);
      if (message_data.userId !== data.userId) {
        setState({url: message_data.url, error: false});
        setUrl2(message_data.url);
      }
    });

    socket.on('play_video', (message_data) => {
      console.log('got new play', message_data, data.userId, playerProps)
      // setMessages((prev) => ([...prev, {position: 'left', type: 'text', title: 'PinkTube Bot', text: `${message_data.userName} started playing`}]));
      if (message_data.userId !== data.userId) {
        playerRef.current.seekTo(message_data.timeStamp, 'seconds');
        // setPlayerProps((prevState) => {
        //   console.log('changing state in got new play')
        //   return ({playing: true, gotAMessage: true}) 
        // });
        setTimeout(() => setPlayerProps((prevState) => ({...prevState, playing: true, gotAMessage: true})), 10);

      }
    });

    socket.on('pause_video', (message_data) => {
      console.log('got new pause', message_data, data.userId, playerProps)
      // setMessages((prev) => ([...prev, {position: 'left', type: 'text', title: 'PinkTube Bot', text: `${message_data.userName} paused`}]));

      if (message_data.userId !== data.userId) {
        // setPlayerProps((prevState) => ({...prevState, playing: false, gotAMessage: true}));
        setTimeout(() => setPlayerProps((prevState) => ({...prevState, playing: false, gotAMessage: true})), 10);
      }
    });

  }, [socket]);

  // useEffect(() => ,[state])

  const handlePlay = () => {
    const timeStamp = playerRef.current.getCurrentTime();
    console.log('aaaa', playerProps.timeStamp, timeStamp, 'at play');
    if (playerProps.gotAMessage === false) {
      console.log('At handle play');
      socket.emit('play_video', {...data , timeStamp: timeStamp});
    }
    setTimeout(() => setPlayerProps((prevState) => ({...prevState, gotAMessage: false})), 10);
    // setPlayerProps((prevState) => ({...prevState, gotAMessage: false}));
  }

  const handlePause = () => {
    const timeStamp = playerRef.current.getCurrentTime();
    console.log('aaaa', playerProps.timeStamp, timeStamp, 'at pause');
    if (playerProps.gotAMessage === false) {
      console.log('At handle pause');
      socket.emit('pause_video', data);
    }
    setTimeout(() => setPlayerProps((prevState) => ({...prevState, gotAMessage: false})), 10);
  }

  const handleStart = () => {
    const timeStamp = playerRef.current.getCurrentTime();
    console.log('aaaa', playerProps.timeStamp, timeStamp, 'at pause');
    if (playerProps.gotAMessage === false) {
      console.log('At handle pause');
      socket.emit('pause_video', data);
    }
    setTimeout(() => setPlayerProps((prevState) => ({...prevState, gotAMessage: false})), 10);
  }


  return (
    <section className='video_player'>
      <ReactPlayer 
        ref={playerRef}
        playing={playerProps.playing}
        url={state.url}
        className='react-player'
        width='100%'
        height='75vh'
        onError={()=>setState(prev => ({...prev, error: true}))}
        controls={true}
        onPause={handlePause}
        onPlay={handlePlay}
        />
      <TextField error={state.error} id="outlined-basic" className='url_input' label="Enter URL" value={url2 || ''} variant="outlined" onChange={e => setUrl2(e.target.value)}/>
      <Button onClick={loadUrl} variant="contained">Load</Button>
    </section>
  );
}


export default VideoPlayer
