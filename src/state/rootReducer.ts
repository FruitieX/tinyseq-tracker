import { songReducer } from './song';
import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  song: songReducer,
});

export type RootState = StateType<typeof rootReducer>;
