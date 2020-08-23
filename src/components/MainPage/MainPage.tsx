import React from 'react';

import { Participant } from '../Participant';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';

const PARTICIPANTS_COUNT = 4;

interface IParticipant {
  selfStatus: ParticipantSelfStatus;
  callStatus?: ParticipantCallStatus;
  secondParticipantId: string;
  incomingMessage?: string;
}

interface IParticipants {
  [id: string]: IParticipant;
}

interface IConnectionManager {
  participants: IParticipants;
  makeCall: (from: string, to: string) => void;
  acceptCall: any;
  rejectCall: any;
  send: any;
  endCall: any;
}

interface IState {
  manager: IConnectionManager;
}

const ConnectionManagerContext = React.createContext({} as IConnectionManager);
ConnectionManagerContext.displayName = 'ConnectionManager';

export const ConnectionManager = ConnectionManagerContext.Consumer;

export class MainPage extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      manager: {
        participants: this.initializeParticipants(),
        makeCall: this.makeCall,
        acceptCall: this.acceptCall,
        rejectCall: this.rejectCall,
        send: this.send,
        endCall: this.endCall,
      },
    };
  }

  initializeParticipants(): IParticipants {
    const participants: { [id: string]: IParticipant } = {};

    for (let i = 0; i < PARTICIPANTS_COUNT; i++) {
      const participantId = getRandomId();

      participants[participantId] = {
        selfStatus: ParticipantSelfStatus.Idle,
        secondParticipantId: '',
      };
    }

    return participants;
  }

  updateParticipantSelfStatus(participantId: string, newStatus: ParticipantSelfStatus): void {
    const newState = { ...this.state };
    newState.manager.participants[participantId].selfStatus = newStatus;

    this.setState(newState);
  }

  updateParticipantCallStatus(participantId: string, newStatus: ParticipantCallStatus): void {
    const newState = { ...this.state };
    newState.manager.participants[participantId].callStatus = newStatus;

    this.setState(newState);
  }

  makeCall = (sourceId: string, targetId: string): void => {
    const target = this.state.manager.participants[targetId];

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

    newState.manager.participants[sourceId].selfStatus = ParticipantSelfStatus.PlacingCall;
    newState.manager.participants[targetId].selfStatus = ParticipantSelfStatus.Ringing;

    newState.manager.participants[sourceId].callStatus = ParticipantCallStatus.RemoteRinging;

    newState.manager.participants[sourceId].secondParticipantId = targetId;
    newState.manager.participants[targetId].secondParticipantId = sourceId;

    this.setState(newState);
  }

  acceptCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.manager.participants[participantId];

    newState.manager.participants[participantId].selfStatus = ParticipantSelfStatus.Talking;
    newState.manager.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Talking;

    newState.manager.participants[participantId].callStatus = undefined;
    newState.manager.participants[secondParticipantId].callStatus = undefined;

    this.setState(newState);
  };

  rejectCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.manager.participants[participantId];

    newState.manager.participants[participantId].selfStatus = ParticipantSelfStatus.Idle;
    newState.manager.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Idle;

    newState.manager.participants[participantId].callStatus = undefined;
    newState.manager.participants[secondParticipantId].callStatus = ParticipantCallStatus.RemoteRejected;

    newState.manager.participants[participantId].secondParticipantId = '';
    newState.manager.participants[secondParticipantId].secondParticipantId = '';

    this.setState(newState);
  };

  send = (participantId: string, message: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.manager.participants[participantId];

    newState.manager.participants[secondParticipantId].incomingMessage = message;

    this.setState(newState);
  }

  endCall = (participantId: string): void => {
    const newState = { ...this.state };
    const { secondParticipantId } = this.state.manager.participants[participantId];

    newState.manager.participants[participantId].selfStatus = ParticipantSelfStatus.Idle;
    newState.manager.participants[secondParticipantId].selfStatus = ParticipantSelfStatus.Idle;

    newState.manager.participants[participantId].callStatus = undefined;
    newState.manager.participants[secondParticipantId].callStatus = undefined;

    newState.manager.participants[participantId].secondParticipantId = '';
    newState.manager.participants[secondParticipantId].secondParticipantId = '';

    newState.manager.participants[secondParticipantId].incomingMessage = undefined;
    newState.manager.participants[secondParticipantId].incomingMessage = undefined;

    this.setState(newState);
  };

  render() {
    const manager = this.state.manager;
    const knownParticipants = Object.keys(manager.participants);
    return (
      <ConnectionManagerContext.Provider value={manager}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' }}>
          {knownParticipants.map((id, key) => {
            return <Participant key={key} id={id} />;
          })}
        </div>
      </ConnectionManagerContext.Provider>
    );
  }
}

function getRandomId(): string {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
}
