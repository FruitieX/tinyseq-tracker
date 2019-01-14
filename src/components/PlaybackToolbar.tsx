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
  playback: PlaybackState,
  togglePlayback: () => void,
}

export class PlaybackHandler extends React.Component<PlaybackProps> {

  render() {
    return (
      <PlaybackToolbar>
        <button id="play" onClick={this.props.togglePlayback}>{this.props.playback === 'playing' ? '▶' : "❚❚"}</button>
        <button id="stop">■</button>
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