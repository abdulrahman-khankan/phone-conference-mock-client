import React, { useState } from 'react';

import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';
import { ParticipantProps } from './Participant.model';
import './Participant.css';

function Participant(props: ParticipantProps) {
  const [message, setMessage] = useState('');
  const [targetParticipandId, setTargetParticipandId] = useState('');

  const handleTargetParticipantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (isNaN(Number(newValue))) {
      return;
    } else {
      setTargetParticipandId(event.target.value);
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { id, callStatus, incomingMessage, selfStatus, endCall, makeCall, send, acceptCall, rejectCall } = props;
  const isIdle = selfStatus === ParticipantSelfStatus.Idle;
  const isRinning = selfStatus === ParticipantSelfStatus.Ringing;
  const isTalking = selfStatus === ParticipantSelfStatus.Talking;
  const isSelfId = targetParticipandId === id;
  const hasFailed = callStatus && callStatus !== ParticipantCallStatus.RemoteRinging;
  const showCallStatus = (callStatus && !hasFailed) || (hasFailed && isIdle);
  return (
    <div>
      <h1>Participant {id}</h1>
      <h2>Status: {selfStatus}</h2>
      <input
        type="text"
        maxLength={3}
        placeholder="Number to call"
        value={targetParticipandId}
        onChange={handleTargetParticipantChange}
      />
      {isTalking ? (
        <button className="reject-button" onClick={() => endCall(id)}>
          End call
        </button>
      ) : (
        <button
          disabled={!isIdle || !targetParticipandId || isSelfId}
          onClick={() => makeCall(id, targetParticipandId)}
        >
          Call
        </button>
      )}
      <div className="section-height-placeholder">{showCallStatus && <span>Call Status: {callStatus}</span>}</div>

      <div className="section-height-placeholder">
        {isTalking && (
          <>
            <div className="section-height-placeholder">
              {incomingMessage && <div>Received message: {incomingMessage}</div>}
            </div>
            <input type="text" placeholder="Write your message here" value={message} onChange={handleMessageChange} />
            <button disabled={!message} onClick={() => send(id, message)}>
              Send
            </button>
          </>
        )}
      </div>

      <div>
        {isRinning && (
          <>
            <button className="accept-button" onClick={() => acceptCall(id)}>
              Answer
            </button>
            <button className="reject-button" onClick={() => rejectCall(id)}>
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Participant;
