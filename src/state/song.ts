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

export interface EditPattern {
  trackId: number,
  patternId: number,
  value: number
}

export const setSong = createStandardAction('song/SET_SONG')<Song>();
export const editPattern = createStandardAction('song/EDIT_PATTERN')<EditPattern>();
export const editSong = createStandardAction('song/EDIT_SONG')<EditSong>();

const actions = { setSong, editSong, editPattern };
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
      case getType(setSong):
        draft.loaded = action.payload;
        break;
      case getType(editSong):
        draft.loaded[action.payload.trackIndex].notes[action.payload.patternIndex] = strReplace(draft.loaded[action.payload.trackIndex].notes[action.payload.patternIndex], action.payload.rowIndex, action.payload.note);
        break;

      case getType(editPattern):
        draft.loaded[action.payload.trackId].patterns[action.payload.patternId] = action.payload.value;
    
        break;
    }
  });
