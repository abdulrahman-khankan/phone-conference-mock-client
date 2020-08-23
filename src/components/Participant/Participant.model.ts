import { IParticipant } from '../shared.model';

export interface ParticipantProps extends IParticipant {
  id: string;
  makeCall: (sourceId: string, targetId: string) => void;
  endCall: (participantId: string) => void;
  acceptCall: (participantId: string) => void;
  rejectCall: (participantId: string) => void;
  send: (participantId: string, message: string) => void;
}
