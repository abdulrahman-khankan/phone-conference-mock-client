import React from 'react';
import PropTypes from 'prop-types';

import { ConnectionManager } from '../MainPage';
import { ParticipantSelfStatus } from '../shared.model';

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
    status: ParticipantSelfStatus.Idle,
  };

  handleTargetParticipantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (isNaN(Number(newValue))) {
      return;
    } else {
      this.setState({ targetParticipant: event.target.value });
    }
  };

  render() {
    const id = this.props.id;
    const { targetParticipant } = this.state;

    return (
      <ConnectionManager>
        {(manager) => {
          return (
            <div>
              <h1>Participant {id}</h1>
              <h2>Status: {this.state.status}</h2>
              <input
                type="text"
                maxLength={3}
                placeholder="Number to call"
                value={targetParticipant}
                onChange={this.handleTargetParticipantChange}
              />
              <button>Call</button>
              {this.state.hasIncomingCall && (
                <div>
                  <button style={{ backgroundColor: 'red', color: 'white' }}>Decline</button>
                  <button style={{ backgroundColor: 'green', color: 'white' }}>Answer</button>
                </div>
              )}
            </div>
          );
        }}
      </ConnectionManager>
    );
  }
}

export default Participant;
