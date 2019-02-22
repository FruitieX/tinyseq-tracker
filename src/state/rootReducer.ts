import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';
// import { reduceReducers } from 'reduce-reducers';

import { songReducer } from './song';
import { playerReducer } from './player';
import { editorReducer } from './editor';

export const rootReducer = combineReducers({
  song: songReducer,
  player: playerReducer,
  editor: editorReducer,
  // editor: reduceReducers(editorReducer, songReducer)
});

export type RootState = StateType<typeof rootReducer>;
