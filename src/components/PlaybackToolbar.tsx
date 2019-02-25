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
  div {
    text-align: center;
    border: 1px solid gray;
    cursor: pointer;

    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
    
    &:hover {
      background-color: #555;
    }
  }
`

const PlayButton = styled.div`
  min-width: 70px;
  height: 25px;
  margin: 0 5px;
  padding-top: 7px;
`
  
const StopButton = styled.div`
  min-width: 30px;
  height: 23px;
  margin: 2px 5px 0 5px;
  padding-top: 6px;
`

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
    return <span ref={this.ref} className={"time-display"}>00:00:00</span>;
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
        <PlayButton onClick={this.props.togglePlayback}>{this.props.playback === 'playing' ? '❚❚' : '▶'}</PlayButton>
        <StopButton onClick={this.stopPlayback}>■</StopButton>
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
