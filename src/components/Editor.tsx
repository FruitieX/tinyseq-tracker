import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import { Instrument, parseSong, TSSong, Song } from '../types/instrument';
import { Track } from './Track';
import SoundFactory from './SoundFactory';

import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { setSong, editSong, EditSong } from '../state/song';
import { Dispatch } from 'redux';
import { DeepReadonly } from 'utility-types';
import { mod } from '../utils/modulo';
import produce from 'immer';
import { togglePlayback } from '../state/player';

const NoteEditor = styled.div`
  grid-area: main-editor;
  display: flex;
  flex-direction: row;
  user-select: none;
  border: solid 1px #fff;
`;

const NoteToolbar = styled.div`
  grid-area: note-toolbar;
  border: solid 1px #fff;
`;

const TrackerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr 3fr;
  grid-template-rows: 150px 6fr 50px 2fr;
  height: 100vh;
  grid-template-areas:
    'panel header right-top'
    'panel main-editor right-top'
    'panel note-toolbar right-top'
    'panel footer right-bottom';
`;

interface KeyCode2Number{
  [key: string]: number;
};

const keyboard2noteMapping:KeyCode2Number = {
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

const PatternWrapper = styled.div`
  grid-area: panel;
`;

const GraphWrapper = styled.div`
  grid-area: header;
`;

interface EditorProps {
  loadedSong: DeepReadonly<Song>;
  loadSong: (song: Song) => void;
  editSong: (editSongParams: EditSong) => void;
  togglePlayback: () => void,
}

interface EditorState {
  selectedTrack: number;
  selectedRow: number;
  currentOctave: number;
  noteSkip: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      selectedTrack: 0,
      selectedRow: 0,
      currentOctave: 0,
      noteSkip: 1,
    };
  }

  handleKeyDown = (ev: KeyboardEvent) => {
    this.setState(
      produce<EditorState>(draft => {
        switch (ev.code) {
          case 'ArrowDown':
            draft.selectedRow = mod(
              draft.selectedRow + 1,
              this.props.loadedSong[draft.selectedTrack].notes.length,
            );
            break;

          case 'ArrowUp':
            draft.selectedRow = mod(
              draft.selectedRow - 1,
              this.props.loadedSong[draft.selectedTrack].notes.length,
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
            this.props.editSong({
                trackIndex: draft.selectedTrack, 
                rowIndex: draft.selectedRow, 
                note: String.fromCharCode(35 + keyboard2noteMapping[ev.code] + 12 * draft.currentOctave)
              });
              draft.selectedRow = mod(
                draft.selectedRow + draft.noteSkip,
                this.props.loadedSong[draft.selectedTrack].notes.length,
              );
            break;
          case 'Backspace':
            this.props.editSong({
                  trackIndex: draft.selectedTrack, 
                  rowIndex: draft.selectedRow, 
                  note: "!"
                });
            draft.selectedRow = mod(
              draft.selectedRow + draft.noteSkip,
              this.props.loadedSong[draft.selectedTrack].notes.length,
            );
            break;
          case 'Delete':
            this.props.editSong({
                  trackIndex: draft.selectedTrack, 
                  rowIndex: draft.selectedRow, 
                  note: " "
                });
            draft.selectedRow = mod(
              draft.selectedRow + draft.noteSkip,
              this.props.loadedSong[draft.selectedTrack].notes.length,
            );
            break;
            case ' ': // Spacebar
            this.props.togglePlayback();
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
  }

  handleOctaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({currentOctave: parseInt(event.target.value)});
  }

  handleNoteSkipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value)) {
      this.setState({noteSkip: parseInt(event.target.value)});
    }
  }

  componentDidMount() {
    this.props.loadSong(parseSong(song as TSSong));
    document.addEventListener('keydown', this.handleKeyDown);
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
        selected={this.state.selectedTrack === index}
        onClickNote={this.handleNoteClick}
        selectedRow={this.state.selectedRow}
      />
    );
  };

  renderToolbar = () => {
    return (
      <div>
        <span>Oct</span><input id="octave" type="number" value={this.state.currentOctave} onChange={this.handleOctaveChange} min="0" max="9"></input>
        <span>Skip</span><input id="noteSkip" type="number" value={this.state.noteSkip} onChange={this.handleNoteSkipChange} min="1" max="32"></input> 
      </div>
    );
  }

  render() {
    return (
      <TrackerWrapper>
        <PatternWrapper>Pootis patterns here</PatternWrapper>
        <GraphWrapper />
        <NoteEditor>{this.props.loadedSong.map(this.renderTrack)}</NoteEditor>
        <NoteToolbar>{this.renderToolbar()}</NoteToolbar>
        <SoundFactory />
      </TrackerWrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadSong: (song: Song) => dispatch(setSong(song)),
  editSong: (editSongParams: EditSong) => dispatch(editSong(editSongParams)),
  togglePlayback: () => dispatch(togglePlayback()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
