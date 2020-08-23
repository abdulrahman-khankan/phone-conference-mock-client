import React, { useState } from 'react';

import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';
import { ParticipantProps } from './Participant.model';
import './Participant.css';

const Participant = React.memo((props: ParticipantProps) => {
  const {
    id,
    selfStatus,
    callStatus,
    secondParticipantId,
    incomingMessage,
    endCall,
    makeCall,
    send,
    acceptCall,
    rejectCall,
  } = props;

  const [message, setMessage] = useState('');
  const [targetParticipandId, setTargetParticipandId] = useState('');

  const targetParticipantChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (isNaN(Number(newValue))) {
      return;
    } else {
      setTargetParticipandId(newValue);
    }
  };

  const messageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

  const sendMessageHandler = () => {
    setMessage('');
    send(id, message);
  };
  const makeCallHandler = () => makeCall(id, targetParticipandId);
  const acceptCallHandler = () => acceptCall(id);
  const rejectCallHandler = () => rejectCall(id);
  const endCallHandler = () => {
    endCall(id);
    setMessage('');
    setTargetParticipandId('');
  };

  const isIdle = selfStatus === ParticipantSelfStatus.Idle;
  const isRinning = selfStatus === ParticipantSelfStatus.Ringing;
  const isTalking = selfStatus === ParticipantSelfStatus.Talking;
  const isSelfId = targetParticipandId === id;
  const hasFailed = callStatus && callStatus !== ParticipantCallStatus.RemoteRinging;
  const showCallStatus = (callStatus && !hasFailed) || (hasFailed && isIdle);
  return (
    <div>
      <h1>Participant: {id}</h1>
      <h2>Status: {selfStatus}</h2>
      {isIdle && (
        <input
          type="text"
          maxLength={3}
          placeholder="Number to call"
          value={targetParticipandId}
          disabled={!isIdle}
          onChange={targetParticipantChangeHandler}
        />
      )}
      {isTalking ? (
        <button className="reject-button" onClick={endCallHandler}>
          End call
        </button>
      ) : (
        isIdle && (
          <button
            className="accept-button"
            disabled={!isIdle || !targetParticipandId || isSelfId}
            onClick={makeCallHandler}
          >
            Call
          </button>
        )
      )}
      <div className="section-height-placeholder">
        {showCallStatus && (
          <span>
            {targetParticipandId} status: {callStatus}
          </span>
        )}
      </div>

      <div className="section-height-placeholder">
        {isTalking && (
          <>
            <div className="section-height-placeholder">
              {incomingMessage && (
                /* Add key to trigger a DOM change to run the animation */
                <div className="message-container" key={incomingMessage}>
                  {secondParticipantId} says: {incomingMessage}
                </div>
              )}
            </div>
            <input type="text" placeholder="Write your message here" value={message} onChange={messageChangeHandler} />
            <button disabled={!message} onClick={sendMessageHandler}>
              Send
            </button>
          </>
        )}
      </div>

      <div>
        {isRinning && (
          <>
            <button className="accept-button" onClick={acceptCallHandler}>
              Answer
            </button>
            <button className="reject-button" onClick={rejectCallHandler}>
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default Participant;
