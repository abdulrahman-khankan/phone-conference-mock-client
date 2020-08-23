import React, { useState } from 'react';

import { ConnectionManager } from '../MainPage';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';
import './Participant.css';

interface IProps {
  id: string;
}

function Participant(props: IProps) {
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

  const id = props.id;
  return (
    <ConnectionManager>
      {(manager) => {
        const self = manager.participants[id];
        const { callStatus, selfStatus } = self;
        const isIdle = selfStatus === ParticipantSelfStatus.Idle;
        const isRinning = selfStatus === ParticipantSelfStatus.Ringing;
        const isTalking = selfStatus === ParticipantSelfStatus.Talking;
        const isSelfId = targetParticipandId === id;
        const hasFailed = callStatus && callStatus !== ParticipantCallStatus.RemoteRinging;
        const showCallStatus = (callStatus && !hasFailed) || (hasFailed && isIdle);
        const hasIncomingMessage = typeof self.incomingMessage !== 'undefined';
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
              <button className="reject-button" onClick={() => manager.endCall(id)}>
                End call
              </button>
            ) : (
              <button
                disabled={!isIdle || !targetParticipandId || isSelfId}
                onClick={() => manager.makeCall(id, targetParticipandId)}
              >
                Call
              </button>
            )}
            <div className="section-height-placeholder">{showCallStatus && <span>Call Status: {callStatus}</span>}</div>

            <div className="section-height-placeholder">
              {isTalking && (
                <>
                  <div className="section-height-placeholder">
                    {hasIncomingMessage && <div>Received message: {self.incomingMessage}</div>}
                  </div>
                  <input
                    type="text"
                    placeholder="Write your message here"
                    value={message}
                    onChange={handleMessageChange}
                  />
                  <button disabled={!message} onClick={() => manager.send(id, message)}>
                    Send
                  </button>
                </>
              )}
            </div>

            <div>
              {isRinning && (
                <>
                  <button className="accept-button" onClick={() => manager.acceptCall(id)}>
                    Answer
                  </button>
                  <button className="reject-button" onClick={() => manager.rejectCall(id)}>
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        );
      }}
    </ConnectionManager>
  );
}

export default Participant;
