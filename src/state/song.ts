import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import produce from 'immer';

import { Song, Instrument } from '../types/instrument';

const strReplace = (str: string, index: number, character: string) =>
  str.slice(0, index) + character + str.slice(index + 1);

export interface AddInstrument {
  instrument: Instrument;
}

export interface EditSongNote {
  trackIndex: number;
  rowIndex: number;
  patternIndex: number;
  note: string;
}

export interface EditSongWaveform {
  trackIndex: number;
  waveform: string;
}

export type EditSong = EditSongNote | EditSongWaveform;

export const isEditSongNote = (action: EditSong): action is EditSongNote =>
  (<EditSongNote>action).note !== undefined;

export const isEditSongWaveform = (
  action: EditSong,
): action is EditSongWaveform =>
  (<EditSongWaveform>action).waveform !== undefined;

export interface AddPattern {
  trackId: number;
  notes: string;
}

export interface EditPattern {
  trackId: number;
  patternId: number;
  value: number;
}

export const addInstrument = createStandardAction('song/ADD_INSTRUMENT')<
  AddInstrument
>();
export const addPattern = createStandardAction('song/ADD_PATTERN')<
  AddPattern
>();
export const editPattern = createStandardAction('song/EDIT_PATTERN')<
  EditPattern
>();
export const editSong = createStandardAction('song/EDIT_SONG')<EditSong>();
export const setSong = createStandardAction('song/SET_SONG')<Song>();

const actions = { addInstrument, addPattern, editPattern, editSong, setSong };
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
      case getType(addInstrument):
        draft.loaded.push(action.payload.instrument);
        break;
      case getType(addPattern):
        draft.loaded[action.payload.trackId].notes.push(action.payload.notes);
        draft.loaded[action.payload.trackId].patterns.push(
          draft.loaded[action.payload.trackId].notes.length - 1,
        );
        break;
      case getType(editPattern):
        draft.loaded[action.payload.trackId].patterns[
          action.payload.patternId
        ] = action.payload.value;
        break;
      case getType(editSong):
        // Edit notes
        if (isEditSongNote(action.payload)) {
          draft.loaded[action.payload.trackIndex].notes[
            action.payload.patternIndex
          ] = strReplace(
            draft.loaded[action.payload.trackIndex].notes[
              action.payload.patternIndex
            ],
            action.payload.rowIndex,
            action.payload.note,
          );
        }

        // Edit waveform
        if (isEditSongWaveform(action.payload)) {
          draft.loaded[action.payload.trackIndex].waveform =
            action.payload.waveform;
        }

        break;
      case getType(setSong):
        draft.loaded = action.payload;
        break;
    }
  });
