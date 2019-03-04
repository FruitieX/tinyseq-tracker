import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import {
  togglePlayback,
  PlaybackState,
  resetPlayback,
  PlayerState,
} from '../state/player';
import { changeRow, changePattern } from '../state/editor';
import { connect } from 'react-redux';
import { Song, getSongLength, time2instrumentPos } from '../types/instrument';

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
`;

const PlayButton = styled.div`
  min-width: 70px;
  height: 25px;
  margin: 0 5px;
  padding-top: 7px;
`;

const StopButton = styled.div`
  min-width: 30px;
  height: 23px;
  margin: 2px 5px 0 5px;
  padding-top: 6px;
`;

interface PlaybackProps {
  playback: PlaybackState;
  togglePlayback: typeof togglePlayback;
  resetPlayback: typeof resetPlayback;
  playbackStarted: PlayerState['playbackStarted'];
  timeSinceStart: number;
  song: Song;
  changeRow: typeof changeRow;
  changePattern: typeof changePattern;
}

const padNumber = (num: number, pad: number, c?: string): string => {
  c = c || '0';
  let n = num.toString();
  return n.length >= pad ? n : new Array(pad - n.length + 1).join(c) + n;
};

export function mstime2MMSSms(time: number): string {
  return (
    padNumber(Math.floor(time / 60000), 2) +
    ':' +
    padNumber(Math.floor(time / 1000) % 60, 2) +
    ':' +
    padNumber(Math.floor(time / 10) % 100, 2)
  );
}

interface TimerProps {
  startTime: number;
  timeSinceStart: number;
  playerState: PlaybackState;
}

export class Timer extends React.Component<TimerProps> {
  animationFrameLoop: number = 0;
  ref: React.RefObject<HTMLDivElement> = React.createRef();

  updateTimer = () => {
    const currentRef = this.ref.current;

    if (currentRef) {
      // console.log("Setting time");
      if (
        this.props.timeSinceStart === 0 &&
        this.props.playerState === 'paused'
      )
        currentRef.innerHTML = '00:00:00';
      else if (this.props.playerState === 'paused') {
        currentRef.innerHTML = mstime2MMSSms(this.props.timeSinceStart);
      } else {
        currentRef.innerHTML = mstime2MMSSms(
          new Date().getTime() - this.props.startTime,
        );
      }
      if (this.props.playerState === 'playing')
        // only request new animation frame when playing
        requestAnimationFrame(this.updateTimer);
    }
  };

  componentDidUpdate() {
    if (this.props.playerState === 'playing') {
      this.animationFrameLoop = requestAnimationFrame(this.updateTimer);
      return true;
    } else {
      this.updateTimer();
      cancelAnimationFrame(this.animationFrameLoop);
    }
    return false;
  }

  render() {
    return (
      <span ref={this.ref} className={'time-display'}>
        00:00:00
      </span>
    );
  }
}

interface NoteTimerProps {
  startTime: number;
  timeSinceStart: number;
  playerState: PlaybackState;
  song: Song;
  changeRow: typeof changeRow;
  changePattern: typeof changePattern;
  // secondsPerRow: number; // editor row refresh rate
}

export class NoteTimer extends React.Component<NoteTimerProps> {
  intervalID: number = 0;
  secondsPerRow: number = 0.5;

  updateEditor = () => {
    let currentTime = new Date().getTime() - this.props.startTime;
    // console.log(currentTime);
    let newState = time2instrumentPos(currentTime, this.props.song, 0);
    console.log(newState);
    this.props.changeRow({ value: newState.row });
    this.props.changePattern({ pattern: newState.pattern });
  };

  componentDidUpdate() {
    if (this.props.playerState === 'playing') {
      this.intervalID = window.setInterval(
        this.updateEditor,
        this.props.song[0].rowDuration * 1000,
      );
      return true;
    } else {
      window.clearInterval(this.intervalID);
    }
    return false;
  }

  // this component does not render anything
  render() {
    return null;
  }
}

export class PlaybackHandler extends React.Component<PlaybackProps> {
  stopPlayback = () => {
    this.props.resetPlayback();
  };

  render() {
    return (
      <PlaybackToolbar>
        <NoteTimer
          startTime={this.props.playbackStarted}
          timeSinceStart={this.props.timeSinceStart}
          playerState={this.props.playback}
          song={this.props.song}
          changeRow={this.props.changeRow}
          changePattern={this.props.changePattern}
        />
        <PlayButton onClick={this.props.togglePlayback}>
          {this.props.playback === 'paused' ? '▶' : '❚❚'}
          {/* {this.props.playback} */}
        </PlayButton>
        <StopButton onClick={this.stopPlayback}>■</StopButton>
        <span>
          <Timer
            startTime={this.props.playbackStarted}
            timeSinceStart={this.props.timeSinceStart}
            playerState={this.props.playback}
          />
        </span>
        &nbsp;/&nbsp;
        <span>{mstime2MMSSms(getSongLength(this.props.song))}</span>
      </PlaybackToolbar>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
  timeSinceStart: state.player.timeSinceStart,
  song: state.song.loaded,
});

const mapDispatchToProps = {
  togglePlayback,
  resetPlayback,
  changeRow,
  changePattern,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaybackHandler);
