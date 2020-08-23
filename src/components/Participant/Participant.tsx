import React from 'react';
import PropTypes from 'prop-types';

import { ConnectionManager } from '../MainPage';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';
import './Participant.css';

interface IProps {
  id: string;
}

class Participant extends React.Component<IProps> {
  static propTypes = {
    id: PropTypes.string,
  };

  state = {
    targetParticipant: '',
    hasIncomingCall: true,
    message: '',
  };

  handleTargetParticipantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (isNaN(Number(newValue))) {
      return;
    } else {
      this.setState({ targetParticipant: event.target.value });
    }
  };

  handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: event.target.value });
  };

  render() {
    const id = this.props.id;
    const { targetParticipant } = this.state;

    return (
      <ConnectionManager>
        {(manager) => {
          const self = manager.participants[id];
          const { callStatus, selfStatus } = self;
          const isIdle = selfStatus === ParticipantSelfStatus.Idle;
          const isRinning = selfStatus === ParticipantSelfStatus.Ringing;
          const isTalking = selfStatus === ParticipantSelfStatus.Talking;
          const isSelfId = targetParticipant === id;
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
                value={targetParticipant}
                onChange={this.handleTargetParticipantChange}
              />
              {isTalking ? (
                <button className="reject-button" onClick={() => manager.endCall(id)}>
                  End call
                </button>
              ) : (
                <button disabled={!isIdle || isSelfId} onClick={() => manager.makeCall(id, targetParticipant)}>
                  Call
                </button>
              )}
              <div className="section-height-placeholder">
                {showCallStatus && <span>Call Status: {callStatus}</span>}
              </div>

              <div className="section-height-placeholder">
                {isTalking && (
                  <>
                    <div className="section-height-placeholder">
                      {hasIncomingMessage && <div>Received message: {self.incomingMessage}</div>}
                    </div>
                    <input
                      type="text"
                      placeholder="Write your message here"
                      value={this.state.message}
                      onChange={this.handleMessageChange}
                    />
                    <button disabled={!this.state.message} onClick={() => manager.send(id, this.state.message)}>
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
}

export default Participant;
