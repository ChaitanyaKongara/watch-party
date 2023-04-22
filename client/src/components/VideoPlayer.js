import React, { Component, useState, useEffect } from 'react'
import { findDOMNode } from 'react-dom'

import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import { TextField, Button } from '@mui/material';

function VideoPlayer ({socket, data, messages, setmessages}) {
  const [state, setState] = useState({url: '', error: false});
  const [url2, setUrl2] = useState('');
  const [playBackRate, setPlayBackRate] = useState(1);
  const loadUrl = () => {
    setState({url: url2, error: false });
  }

  const handlePlay = () => {
    console.log('At handle play');
    // socket.emit('new_video_message');
  }
  
  const handlePause = () => {
    console.log('At handle pause');
    // socket.emit('new_video_message', {...data, })
  }
  
  return (
    <section className='video_player'>
      <ReactPlayer 
        url={state.url}
        className='react-player'
        width='100%'
        height='75vh'
        onError={()=>setState(prev => ({...prev, error: true}))}
        controls={true}
        playbackRate={playBackRate}
        onPlaybackRateChange={() => setPlayBackRate(1)}
        onPause={handlePause}
        onPlay={handlePlay}
        />
      <TextField error={state.error} id="outlined-basic" className='url_input' label="Enter URL" value={url2 || ''} variant="outlined" onChange={e => setUrl2(e.target.value)}/>
      <Button onClick={loadUrl} variant="contained">Load</Button>
    </section>
  );
}


export default VideoPlayer
