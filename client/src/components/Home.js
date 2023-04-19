import React, { useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CreatePartyForm from "./CreatePartyForm";
import JoinPartyForm from "./JoinPartyForm";


const setRandomSessionId = (setCookie) => {
  var id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', idLength = 10;
  const charactersLength = characters.length;
  for (let i = 0; i < idLength; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log(id);
  setCookie("sessionId", id);
}

function Home(props) {
  useEffect(() => {
    console.log('here');
    if (!props.getCookie('sessionId')) {
      setRandomSessionId(props.setCookie);
    }
  }, [props]);
  return (
    <>
      <Popup trigger={<button> Join</button>} modal={true} children={JoinPartyForm} />
      <Popup trigger={<button> Create</button>} modal={true} children={CreatePartyForm} />
    </>
  )
}

export default Home;