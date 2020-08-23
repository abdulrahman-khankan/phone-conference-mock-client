import React, { useState } from 'react';

import { Participant } from '../Participant';
import { initializeParticipants, IParticipantUpdates, getDefaultParticipant } from './MainPage.model';
import { ParticipantSelfStatus, ParticipantCallStatus } from '../shared.model';

export function MainPage() {
  const initialParticipantsState = initializeParticipants();
  const [participants, setParticipants] = useState(initialParticipantsState);

  // Currently we only have updates on maximum two participants as per spec (no group calls).
  // So there's no need to handle more.
  const updateParticipants = (participantChanges: { id: string; changes: IParticipantUpdates }[]): void => {
    const newState = { ...participants };

    participantChanges.forEach((participant) => {
      const oldData = newState[participant.id];
      newState[participant.id] = { ...oldData, ...participant.changes };
    });

    setParticipants(newState);
  };

  const makeCall = (sourceId: string, targetId: string): void => {
    const target = participants[targetId];

    if (!target) {
      return updateParticipants([{ id: sourceId, changes: { callStatus: ParticipantCallStatus.RemoteUnknown } }]);
    }

    const destinationStatus = target.selfStatus;
    if (destinationStatus !== ParticipantSelfStatus.Idle) {
      _signalBusy(sourceId);
    } else {
      _placeCall(sourceId, targetId);
    }
  };

  const _signalBusy = (sourceId: string): void => {
    updateParticipants([{ id: sourceId, changes: { callStatus: ParticipantCallStatus.RemoteBusy } }]);
  };

  const _placeCall = (sourceId: string, targetId: string): void => {
    updateParticipants([
      {
        id: sourceId,
        changes: {
          selfStatus: ParticipantSelfStatus.PlacingCall,
          callStatus: ParticipantCallStatus.RemoteRinging,
          secondParticipantId: targetId,
        },
      },
      {
        id: targetId,
        changes: { selfStatus: ParticipantSelfStatus.Ringing, secondParticipantId: sourceId },
      },
    ]);
  };

  const acceptCall = (participantId: string): void => {
    const { secondParticipantId } = participants[participantId];

    updateParticipants([
      {
        id: participantId,
        changes: { selfStatus: ParticipantSelfStatus.Talking, callStatus: undefined },
      },
      {
        id: secondParticipantId,
        changes: { selfStatus: ParticipantSelfStatus.Talking, callStatus: undefined },
      },
    ]);
  };

  const rejectCall = (participantId: string): void => {
    const { secondParticipantId } = participants[participantId];

    updateParticipants([
      {
        id: participantId,
        changes: { selfStatus: ParticipantSelfStatus.Idle, callStatus: undefined, secondParticipantId: '' },
      },
      {
        id: secondParticipantId,
        changes: {
          selfStatus: ParticipantSelfStatus.Idle,
          callStatus: ParticipantCallStatus.RemoteRejected,
          secondParticipantId: '',
        },
      },
    ]);
  };

  const send = (participantId: string, message: string): void => {
    const { secondParticipantId } = participants[participantId];

    updateParticipants([{ id: secondParticipantId, changes: { incomingMessage: message } }]);
  };

  const endCall = (participantId: string): void => {
    const { secondParticipantId } = participants[participantId];

    updateParticipants([
      { id: participantId, changes: getDefaultParticipant() },
      { id: secondParticipantId, changes: getDefaultParticipant() },
    ]);
  };

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
            acceptCall={acceptCall}
            endCall={endCall}
            makeCall={makeCall}
            rejectCall={rejectCall}
            send={send}
          />
        );
      })}
    </div>
  );
}
