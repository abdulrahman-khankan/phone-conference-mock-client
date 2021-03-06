export enum ParticipantSelfStatus {
  Idle = 'Idle',
  PlacingCall = 'Placing call',
  Ringing = 'Ringing',
  Talking = 'Talking',
}

export enum ParticipantCallStatus {
  RemoteUnknown = 'Remote unknown',
  RemoteRinging = 'Remote is ringing',
  RemoteBusy = 'Remote busy',
  RemoteRejected = 'Remote rejected',
}

export interface IParticipant {
  selfStatus: ParticipantSelfStatus;
  callStatus?: ParticipantCallStatus;
  incomingMessage: string;
  secondParticipantId: string;
}
