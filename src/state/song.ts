import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import { Song } from '../types/instrument';

export const setSong = createStandardAction('song/SET_SONG')<Song>();

const actions = { setSong };
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
) => {
  switch (action.type) {
    case getType(setSong):
      return { ...state, loaded: action.payload };
  }

  return state;
};
