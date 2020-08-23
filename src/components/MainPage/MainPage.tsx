import React from 'react';

import { Participant } from '../Participant';
import { IState, initializeParticipants } from './MainPage.model';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';

export class MainPage extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      participants: initializeParticipants(),
    };
  }

  updateParticipantSelfStatus(participantId: string, newStatus: ParticipantSelfStatus): void {
    const newState = { ...this.state };
    newState.participants[participantId].selfStatus = newStatus;

    this.setState(newState);
  }

  updateParticipantCallStatus(participantId: string, newStatus: ParticipantCallStatus): void {
    const newState = { ...this.state };
    newState.participants[participantId].callStatus = newStatus;

    this.setState(newState);
  }

  makeCall = (sourceId: string, targetId: string): void => {
    const target = this.state.participants[targetId];

    if (!target) {
      return this.updateParticipantCallStatus(sourceId, ParticipantCallStatus.RemoteUnknown);
    }

    const destinationStatus = target.selfStatus;
    if (destinationStatus !== ParticipantSelfStatus.Idle) {
      this.updateParticipantCallStatus(sourceId, ParticipantCallStatus.RemoteBusy);
    } else {
      this.placeCall(sourceId, targetId);
    }
  };

  private placeCall(sourceId: string, targetId: string): void {
    const newState = { ...this.state };

    newState.participants[sourceId].selfStatus = ParticipantSelfStatus.PlacingCall;
    newState.participants[targetId].selfStatus = ParticipantSelfStatus.Ringing;

    newState.participants[sourceId].callStatus = ParticipantCallStatus.RemoteRinging;

    newState.participants[sourceId].secondParticipantId = targetId;
    newState.participants[targetId].secondParticipantId = sourceId;

    this.setState(newState);
  }

  acceptCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.participants[participantId];

    newState.participants[participantId].selfStatus = ParticipantSelfStatus.Talking;
    newState.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Talking;

    newState.participants[participantId].callStatus = undefined;
    newState.participants[secondParticipantId].callStatus = undefined;

    this.setState(newState);
  };

  rejectCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.participants[participantId];

    newState.participants[participantId].selfStatus = ParticipantSelfStatus.Idle;
    newState.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Idle;

    newState.participants[participantId].callStatus = undefined;
    newState.participants[secondParticipantId].callStatus = ParticipantCallStatus.RemoteRejected;

    newState.participants[participantId].secondParticipantId = '';
    newState.participants[secondParticipantId].secondParticipantId = '';

    this.setState(newState);
  };

  send = (participantId: string, message: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.participants[participantId];

    newState.participants[secondParticipantId].incomingMessage = message;

    this.setState(newState);
  };

  endCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.participants[participantId];

    newState.participants[participantId].selfStatus = ParticipantSelfStatus.Idle;
    newState.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Idle;

    newState.participants[participantId].callStatus = undefined;
    newState.participants[secondParticipantId].callStatus = undefined;

    newState.participants[participantId].secondParticipantId = '';
    newState.participants[secondParticipantId].secondParticipantId = '';

    newState.participants[secondParticipantId].incomingMessage = '';
    newState.participants[secondParticipantId].incomingMessage = '';

    this.setState(newState);
  };

  render() {
    const { participants } = this.state;
    const knownParticipants = Object.keys(participants);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' }}>
        {knownParticipants.map((id, key) => {
          const self = participants[id];
          return (
            <Participant
              key={key}
              id={id}
              selfStatus={self.selfStatus}
              callStatus={self.callStatus}
              incomingMessage={self.incomingMessage}
              secondParticipantId={self.secondParticipantId}
              acceptCall={this.acceptCall}
              endCall={this.endCall}
              makeCall={this.makeCall}
              rejectCall={this.rejectCall}
              send={this.send}
            />
          );
        })}
      </div>
    );
  }
}
