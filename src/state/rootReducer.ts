import { songReducer } from './song';
import { playerReducer } from './player';
import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  song: songReducer,
  player: playerReducer,
});

export type RootState = StateType<typeof rootReducer>;
