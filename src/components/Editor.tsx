import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import { parseSong, TSSong, Song } from '../types/instrument';
import SoundFactory from './SoundFactory';
import PlaybackHandler from './PlaybackToolbar';

import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { setSong } from '../state/song';
import { DeepReadonly } from 'utility-types';
import { togglePlayback, updateTime, PlaybackState } from '../state/player';
import PatternWrapper from './PatternWrapper';
import InstrumentManager, {
  InstrumentInstance,
  InstrumentManager as UnwrappedInstrumentManager,
} from './Instrument';
import { keyboard2noteMapping } from '../utils/constants';
import NoteEditor from './NoteEditor';
import { setOctave, setNoteSkip } from '../state/editor';
import { Preview } from './Preview';

import { range } from 'fp-ts/es6/Array';
import FileManager from './FileManager';

const NoteToolbar = styled.div`
  grid-area: note-toolbar;
  border: solid 1px #fff;
`;

const TrackerWrapper = styled.div`
  display: grid;

  padding: 1rem;
  gap: 1rem;

  grid-template-rows: auto 1fr 3fr auto;
  grid-template-columns: auto auto auto;

  grid-template-areas:
    'playback-toolbar   instruments   file-manager'
    'patterns           preview       preview'
    'main-editor        preview       preview'
    'note-toolbar       preview       preview';

  overflow: hidden;
`;

const GraphWrapper = styled.div`
  grid-area: header;
`;

interface EditorProps {
  loadedSong: DeepReadonly<Song>;
  setSong: typeof setSong;
  setOctave: typeof setOctave;
  setNoteSkip: typeof setNoteSkip;

  playback: PlaybackState;
  togglePlayback: () => void;
  updateTime: () => void;
  currentOctave: number;
  noteSkip: number;
  setTime: (time: number) => void;
  activeTrack: number;
}

interface EditorState {
  player?: InstrumentInstance;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  timerHandle?: number;

  instrumentRef = React.createRef<UnwrappedInstrumentManager>();

  handleKeyDown = (ev: KeyboardEvent) => {
    const { currentOctave } = this.props;

    switch (ev.code) {
      case 'Space': // Spacebar
        this.props.togglePlayback();
        break;

      // keyboard piano
      default:
        const note = keyboard2noteMapping[ev.code];

        if (note !== undefined && this.instrumentRef.current) {
          const notes = range(0, this.props.loadedSong.length - 1).map(
            (_, index) => {
              if (index === this.props.activeTrack) {
                return String.fromCharCode(35 + note + 12 * currentOctave);
              }

              return ' ';
            },
          );

          // Play notes instantly
          this.instrumentRef.current
            // @ts-ignore: this is fine
            .getWrappedInstance()
            .playNotes(notes);
        }
        break;
    }
  };

  componentDidMount() {
    // console.log(this.props);
    // const { setSong } = this.props;
    // console.log('there', setSong);
    this.props.setSong(parseSong(song as TSSong));
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    window.clearInterval(this.timerHandle);
  }

  handleOctaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { setOctave } = this.props;
    setOctave({ value: Number(e.target.value) });
  };

  handleNoteSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { setNoteSkip } = this.props;
    setNoteSkip({ value: Number(e.target.value) });
  };

  renderToolbar = () => {
    const { currentOctave, noteSkip } = this.props;

    return (
      <div>
        <span>Oct</span>
        <input
          id="octave"
          type="number"
          value={currentOctave}
          onChange={this.handleOctaveChange}
          min="0"
          max="9"
        />
        <span>Skip</span>
        <input
          id="noteSkip"
          type="number"
          value={noteSkip}
          onChange={this.handleNoteSkipChange}
          min="1"
          max="32"
        />
      </div>
    );
  };

  render() {
    return (
      <TrackerWrapper>
        <PatternWrapper />
        <GraphWrapper />
        <NoteEditor />
        <NoteToolbar>{this.renderToolbar()}</NoteToolbar>
        <PlaybackHandler instrumentRef={this.instrumentRef} />
        <SoundFactory instrumentRef={this.instrumentRef} />
        <InstrumentManager ref={this.instrumentRef} />
        <Preview />
        <FileManager />
      </TrackerWrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
  currentOctave: state.editor.octave,
  noteSkip: state.editor.noteSkip,
  activeTrack: state.editor.track,
});

const mapDispatchToProps = {
  setSong,
  togglePlayback,
  updateTime,
  setOctave,
  setNoteSkip,
  // editSong: (editSongParams: EditSong) => dispatch(editSong(editSongParams)),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
