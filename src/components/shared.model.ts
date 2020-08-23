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
