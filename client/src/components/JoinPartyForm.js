import React, {useState} from "react";
import ReactLoading from 'react-loading';
import axios from '../axiosConfig.js';
import {useNavigate} from 'react-router-dom'

const loadingStyle = {
  position: 'inherit',
  // top: '35%',
  left: '44%',
  width: '10%',
  height: '10%',
};


function JoinPartyForm() {
  const [status, setStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [partyType, setPartyType] = useState('public');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();
  const handleJoinParty = (e) => {
    e.preventDefault();
    setStatus('loading');
    axios.post('/joinParty', {partyType: partyType, passcode: passcode})
          .then(res => {
            navigate('/party', {state: {userName: userName, partyType: partyType, passcode: passcode, roomId: res.data.roomId}});
          })
          .catch(err => setStatus(''))
    console.log(userName, partyType, passcode, `${process.env.REACT_APP_SERVER_IP}:4000/joinParty`);
  }
  if (status === 'loading') {
    return <ReactLoading style={loadingStyle} type={"spin"} color="000"/>
  }
  return (
    <div> 
      Join Party!!
      <form onSubmit={handleJoinParty}>
        <label>
          UserName:
          <input type="text" onChange={(e) => setUserName(e.target.value)}/>
          Party Type:
          <select value={partyType} onChange={(e) => setPartyType(e.target.value)}>
            <option value="public">Public Party</option>
            <option value="private">Private Party</option>
          </select>
          {partyType === 'private' && <>passcode: <input type="text" onChange={(e) => setPasscode(e.target.value)}/></>}
        </label>
        <input type="submit" value="Join" />
      </form>
    </div>
  )
}

export default JoinPartyForm;
