import { observable, action } from 'mobx';
import { mod } from '../utils/modulo';

interface RowOffset {
  offset: number;
  numRows: number;
}
interface RowValue {
  value: number;
}

type ChangeRow = RowOffset | RowValue;

const isRowValue = (payload: ChangeRow): payload is RowValue =>
  (<RowValue>payload).value !== undefined;

interface TrackOffset {
  offset: number;
  numTracks: number;
  song: any;
}
interface TrackValue {
  value: number;
}

type ChangeTrack = TrackOffset | TrackValue;

const isTrackValue = (payload: ChangeTrack): payload is TrackValue =>
  (<TrackValue>payload).value !== undefined;

class EditorState {
  @observable
  track = 0;

  @observable
  row = 0;

  @observable
  pattern = 0;

  @observable
  noteSkip = 0;

  @observable
  octave = 0;

  @action
  changeRow = (row: ChangeRow) => {
    if (isRowValue(row)) {
      this.row = row.value;
    } else {
      this.row = mod(this.row + row.offset, row.numRows);
    }
  };

  @action
  changeTrack = (track: ChangeTrack) => {
    if (isTrackValue(track)) {
      this.track = track.value;
    } else {
      this.track = mod(this.track + track.offset, track.numTracks);

      // // if the current track selection does not contain notes in this pattern, go to the next track that contains notes
      for (
        let i = track.offset > 0 ? 2 : -2;
        track.song[this.track] === undefined;
        i += track.offset > 0 ? 1 : -1
      ) {
        this.track = mod(this.track + i, track.numTracks);
      }
    }
  };

  @action
  changePattern = (pattern: number) => {
    this.pattern = pattern;
  };

  @action
  setNoteSkip = (value: number) => {
    this.noteSkip = value;
  };

  @action
  setOctave = (value: number) => {
    this.octave = value;
  };
}

export const editorState = new EditorState();
