import React from 'react';

import { Participant } from '../Participant';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';

const PARTICIPANTS_COUNT = 4;

interface IParticipant {
  status: ParticipantSelfStatus;
  callStatus?: ParticipantCallStatus;
}

interface IConnectionManager {
  participants: {
    [id: string]: IParticipant;
  };
}

const ConnectionManagerContext = React.createContext({} as IConnectionManager);
ConnectionManagerContext.displayName = 'ConnectionManager';

export const ConnectionManager = ConnectionManagerContext.Consumer;

export class MainPage extends React.Component {
  state = {
    manager: {
      participants: this.initializeParticipants(),
    },
  };

  initializeParticipants() {
    const participants: { [id: string]: IParticipant } = {};

    for (let i = 0; i < PARTICIPANTS_COUNT; i++) {
      const participantId = getRandomId();

      participants[participantId] = {
        status: ParticipantSelfStatus.Idle,
      };
    }

    return participants;
  }

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
  return Math.floor(Math.random() * 1000).toString();
}
