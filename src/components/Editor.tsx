import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import {
  defaultInstrument,
  Instrument,
  parseSong,
  TSSong,
  Song,
} from '../types/instrument';
import { Track } from './Track';
import SoundFactory from './SoundFactory';
import PlaybackHandler from './PlaybackToolbar';

import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { addInstrument, setSong, editSong, EditSong } from '../state/song';
import { Dispatch } from 'redux';
import { DeepReadonly } from 'utility-types';
import { mod } from '../utils/modulo';
import produce from 'immer';
import { togglePlayback, updateTime, PlaybackState } from '../state/player';
import PatternWrapper from './PatternWrapper';
import InstrumentManager, {
  playNote,
  InstrumentInstance,
  initInstrument,
  InstrumentManager as UnwrappedInstrumentManager,
} from './Instrument';

const NoteEditor = styled.div`
  grid-area: main-editor;
  display: flex;
  flex-direction: row;
  user-select: none;
  border: solid 1px #fff;
  overflow: auto;
  .track-name {
    text-align: center;
    margin-bottom: 10px;
  }

  &:focus {
    border: solid 1px #f00;
    outline: none;
  }
`;

const NoteToolbar = styled.div`
  grid-area: note-toolbar;
  border: solid 1px #fff;
`;

const TrackerWrapper = styled.div`
  display: grid;
  grid-template-columns: 15vw 70vw 15vw;
  grid-template-rows: 150px 6fr 50px 2fr;
  height: 100vh;
  grid-template-areas:
    'playback-toolbar header right-top'
    'panel main-editor  right-top'
    'panel note-toolbar right-top'
    'info  footer       right-bottom';
`;

const AddInstrumentButton = styled.input`
  height: 30px;
  background-color: Transparent;
  border: 1px solid gray;
  color: white;
  &:hover {
    background-color: green;
  }
`;

interface KeyCode2Number {
  [key: string]: number;
}

const keyboard2noteMapping: KeyCode2Number = {
  KeyA: 0,
  KeyW: 1,
  KeyS: 2,
  KeyE: 3,
  KeyD: 4,
  KeyF: 5,
  KeyT: 6,
  KeyG: 7,
  KeyY: 8,
  KeyH: 9,
  KeyU: 10,
  KeyJ: 11,
};

const GraphWrapper = styled.div`
  grid-area: header;
`;

interface EditorProps {
  loadedSong: DeepReadonly<Song>;
  loadSong: (song: Song) => void;
  addInstrument: (instrument: Instrument) => void;
  addPattern: (notes: string) => void;
  editSong: (editSongParams: EditSong) => void;
  playback: PlaybackState;
  togglePlayback: () => void;
  updateTime: () => void;
}

interface EditorState {
  selectedTrack: number;
  selectedRow: number;
  currentOctave: number;
  noteSkip: number;
  currentPattern: number;
  player?: InstrumentInstance;
  timerHandle: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  instrumentRef = React.createRef<UnwrappedInstrumentManager>();
  editorRef = React.createRef<HTMLDivElement>();

  constructor(props: EditorProps) {
    super(props);

    this.state = {
      selectedTrack: 0,
      selectedRow: 0,
      currentOctave: 0,
      noteSkip: 1,
      currentPattern: 0,
      timerHandle: 0,
    };
  }

  handleAddInstrumentClick = () => {
    // create new instrument from the default instrument settings
    // TODO: fix the creating of an instrument in a better way
    // var i = <Instrument>{defaultInstrument};
    // make the first note string as long as the the note string of the first instrument
    //  i.notes[0] = Array(this.props.loadedSong[0].notes[0].length + 1).join(" ");
    // and send it off to the addInstrument function
    this.props.addInstrument(defaultInstrument);
  };

  handleKeyDown = (ev: KeyboardEvent) => {
    this.setState(
      produce<EditorState>(draft => {
        // console.log(ev.code);
        switch (ev.code) {
          case 'ArrowDown':
            draft.selectedRow = mod(
              draft.selectedRow + 1,
              this.props.loadedSong[draft.selectedTrack].notes[
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ]
              ].length,
            );
            break;

          case 'ArrowUp':
            draft.selectedRow = mod(
              draft.selectedRow - 1,
              this.props.loadedSong[draft.selectedTrack].notes[
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ]
              ].length,
            );
            break;

          case 'ArrowLeft':
            draft.selectedTrack = mod(
              draft.selectedTrack - 1,
              this.props.loadedSong.length,
            );
            break;

          case 'ArrowRight':
            draft.selectedTrack = mod(
              draft.selectedTrack + 1,
              this.props.loadedSong.length,
            );
            break;
          // keyboard piano
          case 'KeyA':
          case 'KeyW':
          case 'KeyS':
          case 'KeyE':
          case 'KeyD':
          case 'KeyF':
          case 'KeyT':
          case 'KeyG':
          case 'KeyY':
          case 'KeyH':
          case 'KeyU':
          case 'KeyJ':
            const editMode = false;

            if (editMode) {
              this.props.editSong({
                trackIndex: draft.selectedTrack,
                rowIndex: draft.selectedRow,
                patternIndex:
                  this.props.loadedSong[draft.selectedTrack].patterns[
                    draft.currentPattern
                  ] - 1,
                note: String.fromCharCode(
                  35 + keyboard2noteMapping[ev.code] + 12 * draft.currentOctave,
                ),
              });
              draft.selectedRow = mod(
                draft.selectedRow + draft.noteSkip,
                this.props.loadedSong[draft.selectedTrack].notes[
                  this.props.loadedSong[draft.selectedTrack].patterns[
                    draft.currentPattern
                  ] - 1
                ].length,
              );
            } else {
              // Play notes instantly
              if (this.instrumentRef.current)
                this.instrumentRef.current
                  // @ts-ignore: this is fine
                  .getWrappedInstance()
                  .playNote(
                    35 +
                      keyboard2noteMapping[ev.code] +
                      12 * draft.currentOctave,
                  );
            }
            break;
          case 'Backspace':
            this.props.editSong({
              trackIndex: draft.selectedTrack,
              rowIndex: draft.selectedRow,
              patternIndex:
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ] - 1,
              note: '!',
            });
            draft.selectedRow = mod(
              draft.selectedRow + draft.noteSkip,
              this.props.loadedSong[draft.selectedTrack].notes[
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ] - 1
              ].length,
            );
            break;
          case 'Delete':
            this.props.editSong({
              trackIndex: draft.selectedTrack,
              rowIndex: draft.selectedRow,
              patternIndex:
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ] - 1,
              note: ' ',
            });
            draft.selectedRow = mod(
              draft.selectedRow + draft.noteSkip,
              this.props.loadedSong[draft.selectedTrack].notes[
                this.props.loadedSong[draft.selectedTrack].patterns[
                  draft.currentPattern
                ] - 1
              ].length,
            );
            break;
          case 'Space': // Spacebar
            this.props.togglePlayback();
            if (this.props.playback === 'paused') {
              draft.timerHandle = window.setInterval(this.props.updateTime, 10);
            } else {
              window.clearInterval(draft.timerHandle);
            }
            break;

          default:
            console.log('Unhandled key event', ev);
        }
      }),
    );
  };

  handleNoteClick = (trackIndex: number, rowIndex: number) => {
    this.setState({
      selectedTrack: trackIndex,
      selectedRow: rowIndex,
    });
  };

  handleOctaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value)) {
      this.setState({ currentOctave: parseInt(event.target.value) });
    }
  };

  handleNoteSkipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value)) {
      this.setState({ noteSkip: parseInt(event.target.value) });
    }
  };

  componentDidMount() {
    this.props.loadSong(parseSong(song as TSSong));
    this.editorRef.current!.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  renderTrack = (instrument: Instrument, index: number) => {
    return (
      <Track
        key={index}
        index={index}
        instrument={instrument}
        currentPattern={this.state.currentPattern}
        selected={this.state.selectedTrack === index}
        onClickNote={this.handleNoteClick}
        selectedRow={this.state.selectedRow}
      />
    );
  };

  renderToolbar = () => {
    return (
      <div>
        <span>Oct</span>
        <input
          id="octave"
          type="number"
          value={this.state.currentOctave}
          onChange={this.handleOctaveChange}
          min="0"
          max="9"
        />
        <span>Skip</span>
        <input
          id="noteSkip"
          type="number"
          value={this.state.noteSkip}
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
        <PatternWrapper
          currentPattern={this.state.currentPattern}
          setCurrentPattern={this.setCurrentPattern}
        />
        <GraphWrapper />
        <NoteEditor innerRef={this.editorRef} tabIndex={0}>
          {this.props.loadedSong.map(this.renderTrack as any)}
          <AddInstrumentButton
            type="button"
            value="+"
            onClick={this.handleAddInstrumentClick}
          />
        </NoteEditor>
        <NoteToolbar>{this.renderToolbar()}</NoteToolbar>
        <PlaybackHandler />
        <SoundFactory selectedTrack={this.state.selectedTrack} />
        <InstrumentManager ref={this.instrumentRef} />
      </TrackerWrapper>
    );
  }

  setCurrentPattern = (value: number) => {
    this.setState({ currentPattern: value });
  };
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addInstrument: (instrument: Instrument) =>
    dispatch(addInstrument({ instrument })),
  loadSong: (song: Song) => dispatch(setSong(song)),
  editSong: (editSongParams: EditSong) => dispatch(editSong(editSongParams)),
  togglePlayback: () => dispatch(togglePlayback()),
  updateTime: () => dispatch(updateTime()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
