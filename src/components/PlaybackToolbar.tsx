import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import { Dispatch } from 'redux';
import { togglePlayback, PlaybackState } from '../state/player';
import { connect } from 'react-redux';

const PlaybackToolbar = styled.div`
  grid-area: playback-toolbar;
`;

interface PlaybackProps {
  playback: PlaybackState;
  togglePlayback: () => void;
  playbackStarted: number;
}

const padNumber = (num: number, pad: number, c?: string): string => {
  c = c || '0';
  let n = num.toString();
  return n.length >= pad ? n : new Array(pad - n.length + 1).join(c) + n;
};

export class PlaybackHandler extends React.Component<PlaybackProps> {
  render() {
    return (
      <PlaybackToolbar>
        <button id="play" onClick={this.props.togglePlayback}>
          {this.props.playback === 'playing' ? '❚❚' : '▶'}
        </button>
        <button id="stop">■</button>
        <span>
          {padNumber(this.props.playbackStarted.getMinutes(), 2)}:
          {padNumber(this.props.playbackStarted.getSeconds(), 2)}:
          {padNumber(this.props.playbackStarted.getMilliseconds(), 3)}
        </span>
      </PlaybackToolbar>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  togglePlayback: () => dispatch(togglePlayback()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaybackHandler);
