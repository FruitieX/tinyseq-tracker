import React from 'react';
import styled from 'styled-components';
import { PlaybackState, playerState } from '../state/player';
import { editorState } from '../state/editor';
import { getSongLength, time2instrumentPos } from '../types/instrument';
import { playNote } from './Instrument';
import { baseButton } from '../utils/styles';
import { noteCharToSound } from './Track';
import { songState } from '../state/song';
import { observer } from 'mobx-react-lite';

const PlaybackToolbar = styled.div`
  grid-area: playback-toolbar;

  display: grid;
  grid-auto-flow: column;

  gap: 1rem;
  align-items: center;
`;

const PlayButton = styled.button`
  ${baseButton} width: 70px;
`;

const StopButton = styled.button`
  ${baseButton} width: 32px;
`;

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

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameLoop);
  }

  render() {
    return (
      <span ref={this.ref} className={'time-display'}>
        00:00:00
      </span>
    );
  }
}

export const PlaybackHandler: React.FunctionComponent = observer(() => {
  const [intervalId, setIntervalId] = React.useState(0);

  const tickNotes = () => {
    const currentTime = new Date().getTime() - playerState.playbackStarted;

    if (currentTime >= getSongLength(songState.loaded)) {
      playerState.togglePlayback();
    } else {
      const newPos = time2instrumentPos(currentTime, songState.loaded, 0);
      const notes = songState.loaded
        .map(i => i.notes[i.patterns[newPos.pattern] - 1])
        .map(n => (n === undefined ? '' : n.charAt(newPos.row)));

      // Play notes instantly
      console.log('playing notes ', ...notes);

      notes.forEach((n, i) =>
        playNote(playerState.instrumentInstances[i], noteCharToSound(n) - 33),
      );

      editorState.changeRow({ value: newPos.row });
      editorState.changePattern(newPos.pattern);
    }
  };

  const togglePlayback = (e: React.MouseEvent<HTMLButtonElement>) => {
    // don't leave button focused after click
    e.currentTarget.blur();

    playerState.togglePlayback();
  };

  const stopPlayback = (e: React.MouseEvent<HTMLButtonElement>) => {
    // don't leave button focused after click
    e.currentTarget.blur();

    editorState.changeRow({ value: 0 });
    editorState.changePattern(0);
    playerState.resetPlayback();
  };

  React.useEffect(() => {
    if (playerState.playback === 'playing') {
      // Just started playback
      window.clearInterval(intervalId);
      tickNotes();
      setIntervalId(
        window.setInterval(tickNotes, songState.loaded[0].rowDuration * 1000),
      );
    } else {
      // Just paused playback
      window.clearInterval(intervalId);
    }
  }, [playerState.playback]);

  const songLength = getSongLength(songState.loaded);

  return (
    <PlaybackToolbar>
      <PlayButton onClick={togglePlayback}>
        {playerState.playback === 'paused' ? '▶' : '❚❚'}
        {/* {this.props.playback} */}
      </PlayButton>
      <StopButton onClick={stopPlayback}>■</StopButton>
      <span>
        <Timer
          startTime={playerState.playbackStarted}
          timeSinceStart={playerState.timeSinceStart}
          playerState={playerState.playback}
        />
      </span>
      &nbsp;/&nbsp;
      <span>{mstime2MMSSms(songLength)}</span>
    </PlaybackToolbar>
  );
});

export default PlaybackHandler;
