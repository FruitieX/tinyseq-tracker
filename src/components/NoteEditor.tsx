import React from 'react';
import styled from 'styled-components';
import { DeepReadonly } from 'utility-types';
import {
  Song,
  Instrument,
  defaultInstrument,
  timeFromBeginning,
} from '../types/instrument';
import { addInstrument, editSong } from '../state/song';
import { Track } from './Track';
import { keyboard2noteMapping } from '../utils/constants';
import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { changeRow, changeTrack } from '../state/editor';
import { setTime, PlaybackState } from '../state/player';

const Wrapper = styled.div`
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

const AddInstrumentButton = styled.input`
  height: 30px;
  background-color: Transparent;
  border: 1px solid gray;
  color: white;
  &:hover {
    background-color: green;
  }
`;

interface EditorProps {
  loadedSong: DeepReadonly<Song>;

  addInstrument: typeof addInstrument;
  editSong: typeof editSong;

  row: number;
  changeRow: typeof changeRow;

  track: number;
  changeTrack: typeof changeTrack;

  pattern: number;
  noteSkip: number;
  octave: number;

  setTime: typeof setTime;
  playing: PlaybackState;
}

class NoteEditor extends React.PureComponent<EditorProps> {
  editorRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.editorRef.current!.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (
      (prevProps.row !== this.props.row ||
        prevProps.pattern !== this.props.pattern) &&
      this.props.playing === 'paused'
    ) {
      this.props.setTime(
        timeFromBeginning(
          this.props.loadedSong,
          this.props.track,
          this.props.pattern,
          this.props.row,
        ),
      );
    }
  }

  handleKeyDown = (ev: KeyboardEvent) => {
    const {
      row,
      changeRow,

      track,
      changeTrack,

      editSong,

      pattern,
      noteSkip,
      octave,
      loadedSong,
    } = this.props;

    const activeTrack = loadedSong[track];
    const activeTrackNotes =
      activeTrack && activeTrack.notes[activeTrack.patterns[pattern]];

    const numRows = activeTrackNotes ? activeTrackNotes.length : 1;

    const numTracks = this.props.loadedSong.length;

    const patternNotes = loadedSong.map(t => t.notes[t.patterns[pattern] - 1]);

    switch (ev.code) {
      case 'ArrowDown':
        ev.stopPropagation();
        changeRow({ offset: 1, numRows });
        return;

      case 'ArrowUp':
        ev.stopPropagation();
        changeRow({ offset: -1, numRows });
        return;

      case 'ArrowLeft':
        ev.stopPropagation();
        return changeTrack({
          offset: -1,
          numTracks: numTracks,
          song: patternNotes,
        });

      case 'ArrowRight':
        ev.stopPropagation();
        return changeTrack({
          offset: 1,
          numTracks: numTracks,
          song: patternNotes,
        });

      case 'Backspace':
        ev.stopPropagation();

        editSong({
          trackIndex: track,
          rowIndex: row,
          patternIndex: this.props.loadedSong[track].patterns[pattern] - 1,
          note: '!',
        });

        return changeRow({ offset: noteSkip, numRows });

      case 'Delete':
        ev.stopPropagation();

        editSong({
          trackIndex: track,
          rowIndex: row,
          patternIndex: this.props.loadedSong[track].patterns[pattern] - 1,
          note: ' ',
        });

        return changeRow({ offset: noteSkip, numRows });

      // edit notes
      default:
        const note = keyboard2noteMapping[ev.code];

        if (note !== undefined) {
          ev.stopPropagation();

          editSong({
            trackIndex: track,
            rowIndex: row,
            patternIndex: this.props.loadedSong[track].patterns[pattern] - 1,
            note: String.fromCharCode(35 + note + 12 * octave),
          });

          return changeRow({ offset: noteSkip, numRows });
        }
    }
  };

  handleAddInstrumentClick = () => {
    const { addInstrument } = this.props;

    // create new instrument from the default instrument settings
    // TODO: fix the creating of an instrument in a better way
    // var i = <Instrument>{defaultInstrument};
    // make the first note string as long as the the note string of the first instrument
    //  i.notes[0] = Array(this.props.loadedSong[0].notes[0].length + 1).join(" ");
    // and send it off to the addInstrument function
    addInstrument({ instrument: defaultInstrument });
  };

  handleNoteClick = (trackIndex: number, rowIndex: number) => {
    const { changeRow, changeTrack } = this.props;

    changeTrack({ value: trackIndex });
    changeRow({ value: rowIndex });
  };

  renderTrack = (instrument: Instrument, index: number) => {
    const {
      row: selectedRow,
      track: selectedTrack,
      pattern: currentPattern,
    } = this.props;

    return (
      <Track
        key={index}
        index={index}
        instrument={instrument}
        currentPattern={currentPattern}
        selected={selectedTrack === index}
        onClickNote={this.handleNoteClick}
        selectedRow={selectedRow}
      />
    );
  };

  render() {
    const { loadedSong } = this.props;

    return (
      <Wrapper innerRef={this.editorRef} tabIndex={0}>
        {loadedSong.map(this.renderTrack as any)}

        <AddInstrumentButton
          type="button"
          value="+"
          onClick={this.handleAddInstrumentClick}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,

  row: state.editor.row,
  track: state.editor.track,

  pattern: state.editor.pattern,

  noteSkip: state.editor.noteSkip,
  octave: state.editor.octave,
  playing: state.player.playback,
});

const mapDispatchToProps = {
  addInstrument,
  editSong,

  changeRow,
  changeTrack,

  setTime,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NoteEditor);
