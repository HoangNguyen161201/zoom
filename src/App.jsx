import './App.css';
import axios from 'axios'
import { useEffect, useRef, useState } from 'react';
import { DailyProvider, useDaily,  useParticipant, useVideoTrack, useParticipantIds,useMediaTrack, useDailyEvent,useLocalParticipant } from '@daily-co/daily-react-hooks';
import DailyIframe from '@daily-co/daily-js';



const Tile = ({ id, isScreenShare })=> {
  const videoTrack = useMediaTrack(id, isScreenShare ? 'screenVideo' : 'video');
  const audioTrack = useMediaTrack(id, isScreenShare ? 'screenAudio' : 'audio');

  const videoElement = useRef(null);
  const audioElement = useRef(null);

  useEffect(() => {
    /*  The track is ready to be played. We can show video of the remote participant in the UI.*/
    if (videoTrack?.state === 'playable') {
      videoElement.current &&
        (videoElement.current.srcObject =
          videoTrack && new MediaStream([videoTrack.persistentTrack]));
    }
  }, [videoTrack]);

  useEffect(() => {
    if (audioTrack?.state === 'playable') {
      audioElement?.current &&
        (audioElement.current.srcObject =
          audioTrack && new MediaStream([audioTrack.persistentTrack]));
    }
  }, [audioTrack]);

  return (
    <div className={isScreenShare ? 'tile-screenshare' : 'tile-video'}>
      {videoTrack && <video autoPlay muted playsInline ref={videoElement} />}
      {audioTrack && <audio autoPlay playsInline ref={audioElement} />}
    </div>
  );
}


const Call = ()=> {
  const daily = useDaily()
  const localParticipant = useLocalParticipant()
  const localParticipantVideoTrack = useVideoTrack(localParticipant?.session_id);
  const localVideoElement = useRef(null);
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });
  daily.join({
    url: 'https://meeting1215.daily.co/dghhhhffev',
    userName: 'hoang nguyen quang'
  })
  useEffect(()=> {
    console.log(daily.meetingState())
  }, [daily])
  useEffect(() => {
    if (!localParticipantVideoTrack.persistentTrack) return;
    localVideoElement?.current &&
      (localVideoElement.current.srcObject =
        localParticipantVideoTrack.persistentTrack &&
        new MediaStream([localParticipantVideoTrack?.persistentTrack]));
  }, [localParticipantVideoTrack.persistentTrack]);

  return <div>
    {localParticipant?.user_name}
    <button onClick={()=> {
      daily.setLocalVideo(true)
      daily.setLocalAudio(true)
    }}>
      set camera
    </button>
    <button onClick={()=> {
      daily.setLocalVideo(false)
      daily.setLocalAudio(false)

    }}>
      close camera
    </button>
    <video autoPlay muted playsInline ref={localVideoElement} />
    {remoteParticipantIds?.length > 0 ? (
          <>
            {remoteParticipantIds.map((id) => (
              <Tile key={id} id={id} />
            ))}
           
          </>
        ) : (
          // When there are no remote participants or screen shares
          <div className="info-box">
            <h1>Waiting for others</h1>
            <p>Invite someone by sharing this link:</p>
            <span className="room-url">{window.location.href}</span>
          </div>
        )}
    </div>
}

function App() {
  const [callObject, setCallObject] = useState(DailyIframe.createCallObject());
  const [apiError, setApiError] = useState(false);

  return (
    <div>
      ddd
      {
        callObject && <DailyProvider callObject={callObject}>
          <Call/>
        </DailyProvider>
      }
    </div>
  );
}

export default App;
