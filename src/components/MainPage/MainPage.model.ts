import { IParticipant, ParticipantSelfStatus } from '../shared.model';

const PARTICIPANTS_COUNT = 4;

export interface IState {
  participants: IParticipants;
}

export interface IParticipants {
  [id: string]: IParticipant & { secondParticipantId: string };
}

export function initializeParticipants(): IParticipants {
  const participants: IParticipants = {};

  for (let i = 0; i < PARTICIPANTS_COUNT; i++) {
    let participantId = getRandomId();

    // One time re-randomization should be enough in reality. Otherwise we loop few times until we get a new unique id.
    if (participants[participantId]) {
      participantId = getRandomId();
    }

    participants[participantId] = {
      selfStatus: ParticipantSelfStatus.Idle,
      secondParticipantId: '',
      incomingMessage: '',
    };
  }

  return participants;
}

function getRandomId(): string {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
}
