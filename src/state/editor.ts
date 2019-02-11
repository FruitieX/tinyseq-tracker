import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import produce from 'immer';

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

export const changeRow = createStandardAction('editor/CHANGE_ROW')<ChangeRow>();

interface TrackOffset {
  offset: number;
  numTracks: number;
}
interface TrackValue {
  value: number;
}

type ChangeTrack = TrackOffset | TrackValue;

const isTrackValue = (payload: ChangeTrack): payload is TrackValue =>
  (<TrackValue>payload).value !== undefined;

export const changeTrack = createStandardAction('editor/CHANGE_TRACK')<
  ChangeTrack
>();

export const changePattern = createStandardAction('editor/CHANGE_PATTERN')<{
  pattern: number;
}>();

export const setNoteSkip = createStandardAction('editor/SET_NOTE_SKIP')<{
  value: number;
}>();

export const setOctave = createStandardAction('editor/SET_OCTAVE')<{
  value: number;
}>();

const actions = {
  changePattern,
  changeRow,
  changeTrack,
  setNoteSkip,
  setOctave,
};
export type EditorActions = ActionType<typeof actions>;

export type EditorState = DeepReadonly<{
  track: number;
  row: number;

  pattern: number;

  noteSkip: number;
  octave: number;
}>;

const initialState = {
  track: 0,
  row: 0,

  pattern: 0,

  noteSkip: 0,
  octave: 0,
};

export const editorReducer: Reducer<EditorState, EditorActions> = (
  state = initialState,
  action,
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(changePattern):
        draft.pattern = action.payload.pattern;
        break;

      case getType(changeRow): {
        const payload = action.payload;

        if (isRowValue(payload)) {
          draft.row = payload.value;
        } else {
          draft.row = mod(state.row + payload.offset, payload.numRows);
        }

        break;
      }

      case getType(changeTrack): {
        const payload = action.payload;

        if (isTrackValue(payload)) {
          draft.track = payload.value;
        } else {
          draft.track = mod(state.track + payload.offset, payload.numTracks);
        }

        break;
      }

      case getType(setNoteSkip):
        draft.noteSkip = action.payload.value;
        break;

      case getType(setOctave):
        draft.octave = action.payload.value;

        break;
    }
  });
