import { IParticipant, ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';

const PARTICIPANTS_COUNT = 4;

interface IParticipants {
  [id: string]: IParticipant;
}

export interface IParticipantUpdates {
  selfStatus?: ParticipantSelfStatus;
  callStatus?: ParticipantCallStatus;
  incomingMessage?: string;
  secondParticipantId?: string;
}

export const getDefaultParticipant = (): IParticipant => ({
  selfStatus: ParticipantSelfStatus.Idle,
  callStatus: undefined,
  secondParticipantId: '',
  incomingMessage: '',
});

export function initializeParticipants(): IParticipants {
  const participants: IParticipants = {};

  for (let i = 0; i < PARTICIPANTS_COUNT; i++) {
    let participantId = getRandomId();

    // One time re-randomization should be enough in reality. Otherwise we loop few times until we get a new unique id.
    if (participants[participantId]) {
      participantId = getRandomId();
    }

    participants[participantId] = getDefaultParticipant();
  }

  return participants;
}

function getRandomId(): string {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
}
