import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import { Song } from '../types/instrument';
import produce from 'immer';

const strReplace = (str: string, index: number, character: string) => str.slice(0, index) + character + str.slice(index + 1);

export interface EditSong {
  trackIndex: number;
  rowIndex: number;
  patternIndex: number;
  note: string;
};

export interface AddPattern {
  trackId: number,
  notes: string,
}

export interface EditPattern {
  trackId: number,
  patternId: number,
  value: number
}

export const addPattern = createStandardAction('song/ADD_PATTERN')<AddPattern>();
export const editPattern = createStandardAction('song/EDIT_PATTERN')<EditPattern>();
export const editSong = createStandardAction('song/EDIT_SONG')<EditSong>();
export const setSong = createStandardAction('song/SET_SONG')<Song>();

const actions = { addPattern, editPattern, editSong, setSong };
export type SongActions = ActionType<typeof actions>;

export type SongState = DeepReadonly<{
  loaded: Song;
}>;

const initialState = {
  loaded: [],
};

export const songReducer: Reducer<SongState, SongActions> = (
  state = initialState,
  action,
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(addPattern):
        console.log(action.payload);
        draft.loaded[action.payload.trackId].notes.push(action.payload.notes);
        draft.loaded[action.payload.trackId].patterns.push(draft.loaded[action.payload.trackId].notes.length - 1);
      break;
        case getType(editPattern):
        draft.loaded[action.payload.trackId].patterns[action.payload.patternId] = action.payload.value;
        break;
      case getType(editSong):
        draft.loaded[action.payload.trackIndex].notes[action.payload.patternIndex] = strReplace(draft.loaded[action.payload.trackIndex].notes[action.payload.patternIndex], action.payload.rowIndex, action.payload.note);
        break;
      case getType(setSong):
        draft.loaded = action.payload;
        break;
    }
  });
