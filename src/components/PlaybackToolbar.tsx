import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import {
  togglePlayback,
  PlaybackState,
  resetPlayback,
  PlayerState,
} from '../state/player';
import { connect } from 'react-redux';

const PlaybackToolbar = styled.div`
  grid-area: playback-toolbar;
  display: flex;
`;

const PlayButton = styled.input`
  min-width: 70px;
  max-height: 30px;
  margin: 0 5px;
  `;

const StopButton = styled.input`
  min-width: 30px;
  max-height: 30px;
  margin: 0 5px;
`;

interface PlaybackProps {
  playback: PlaybackState;
  togglePlayback: () => void;
  resetPlayback: () => void;
  playbackStarted: PlayerState['playbackStarted'];
  timeSinceStart: number;
}

const padNumber = (num: number, pad: number, c?: string): string => {
  c = c || '0';
  let n = num.toString();
  return n.length >= pad ? n : new Array(pad - n.length + 1).join(c) + n;
};

export function mstime2MMSSms(time: number): string {
  return padNumber(Math.floor(time / 60000), 2) + ":"
    + padNumber(Math.floor(time / 1000) % 60, 2) + ":"
    + padNumber(Math.floor(time / 10) % 100, 2)
}

interface TimerProps {
  startTime: number;
  playerState: PlaybackState;
}

export class Timer extends React.Component<TimerProps> {
  animationFrameLoop: number = 0;
  ref: React.RefObject<HTMLDivElement> = React.createRef();

  updateTimer = () => {
    const currentRef = this.ref.current;
  
    if (currentRef) {
      // console.log("Setting time");
      currentRef.innerHTML = mstime2MMSSms(
        (new Date().getTime() - this.props.startTime),
      );
      if (this.props.playerState === 'playing')
        // only request new animation frame when playing
        requestAnimationFrame(this.updateTimer);
    }
  }

  shouldComponentUpdate() {

    if (this.props.playerState === 'playing') {
      // cancelAnimationFrame(this.animationFrameLoop);
      // console.log("Animation stopped");
    } else {
      // the state updates somehow inverted. Therefore, the playing and paused are switched 
      this.animationFrameLoop = requestAnimationFrame(this.updateTimer);
      // console.log("Started Animationframe ID", this.animationFrameLoop);
    }
    // return (this.props.playerState === 'playing');
    return false;
  }

  componentDidMount() {
    // console.log("Starting timer");
    // this.animationFrameLoop = requestAnimationFrame(this.updateTimer.bind(this));
  }

  componentWillUnmount() {
    // console.log("Stopping timer");
    // cancelAnimationFrame(this.animationFrameLoop);
  }

  render() {
    return <div ref={this.ref}>00:00:00</div>;
    // return <div ref={this.ref}>{mstime2MMSSms( (new Date().getTime() - this.props.startTime) ) }</div>;
  }
}

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
          <Timer startTime={this.props.playbackStarted.getTime()} playerState={this.props.playback} />
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

const mapDispatchToProps = {
  togglePlayback,
  resetPlayback,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaybackHandler);
