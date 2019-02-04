import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import { Dispatch } from 'redux';
import { togglePlayback, PlaybackState, resetPlayback } from '../state/player';
import { connect } from 'react-redux';

const PlaybackToolbar = styled.div`
  grid-area: playback-toolbar;
`;

const PlayButton = styled.input`
  width: 70px;
  height: 30px;
`;

const StopButton = styled.input`
  width: 25px;
  height: 25px;
`;

interface PlaybackProps {
  playback: PlaybackState;
  togglePlayback: () => void;
  resetPlayback: () => void;
  playbackStarted: Date;
  timeSinceStart: number;
}

const padNumber = (num: number, pad: number, c?: string): string => {
  c = c || '0';
  let n = num.toString();
  return n.length >= pad ? n : new Array(pad - n.length + 1).join(c) + n;
};

export class PlaybackHandler extends React.Component<PlaybackProps> {
  stopPlayback = () => {
    this.props.togglePlayback();
    this.props.resetPlayback();
  };

  render() {
    return (
      <PlaybackToolbar>
        <PlayButton
          type="button"
          value={this.props.playback === 'playing' ? '❚❚' : '▶'}
          onClick={this.props.togglePlayback}
          tabIndex={-1}
        />
        <StopButton
          type="button"
          value="■"
          onClick={this.stopPlayback}
          tabIndex={-1}
        />
        <span>
          {padNumber(Math.floor(this.props.timeSinceStart / 60000), 2)}:
          {padNumber(Math.floor(this.props.timeSinceStart / 1000) % 60, 2)}:
          {padNumber(Math.floor(this.props.timeSinceStart / 10) % 100, 2)}
        </span>
      </PlaybackToolbar>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
  timeSinceStart: state.player.timeSinceStart,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  togglePlayback: () => dispatch(togglePlayback()),
  resetPlayback: () => dispatch(resetPlayback()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaybackHandler);
