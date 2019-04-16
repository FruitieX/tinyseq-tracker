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
import { InstrumentManager } from './Instrument';

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
  instrumentRef: React.RefObject<InstrumentManager>;
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

export class PlaybackHandler extends React.Component<PlaybackProps> {
  intervalID: number = 0;

  tickNotes = () => {
    const currentTime = new Date().getTime() - this.props.playbackStarted;
    if (currentTime >= getSongLength(this.props.song)) {
      this.props.togglePlayback();
    } else {
      const newPos = time2instrumentPos(currentTime, this.props.song, 0);
      const notes = this.props.song
        .map(i => i.notes[i.patterns[newPos.pattern] - 1])
        .map(n => (n === undefined ? '' : n.charAt(newPos.row)));
      if (this.props.instrumentRef.current) {
        this.props.instrumentRef.current
          // @ts-ignore: this is fine
          .getWrappedInstance()
          .playNotes(notes);
      }
      this.props.changeRow({ value: newPos.row });
      this.props.changePattern({ pattern: newPos.pattern });
    }
  };

  stopPlayback = () => {
    this.props.resetPlayback();
  };

  componentDidUpdate() {
    if (this.props.playback === 'playing') {
      this.intervalID = window.setInterval(
        this.tickNotes,
        this.props.song[0].rowDuration * 1000,
      );
    } else {
      window.clearInterval(this.intervalID);
    }
  }

  render() {
    const songLength = getSongLength(this.props.song);

    return (
      <PlaybackToolbar>
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
        <span>{mstime2MMSSms(songLength)}</span>
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
