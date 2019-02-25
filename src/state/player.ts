import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import produce from 'immer';

export const togglePlayback = createStandardAction(
  'playback/TOGGLE_PLAYBACK',
)();
export const resetPlayback = createStandardAction('playback/RESET_PLAYBACK')();
export const updateTime = createStandardAction('playback/UPDATE_TIME')();
export const setTime = createStandardAction('playback/SET_TIME')<number>();


const actions = { togglePlayback, resetPlayback, updateTime, setTime };
export type PlayerActions = ActionType<typeof actions>;

export type PlaybackState = 'playing' | 'paused';

export type PlayerState = {
  playback: PlaybackState;
  playbackStarted: Date; // unix timestamp in ms
  timeSinceStart: number;
};

const initialState: PlayerState = {
  playback: 'paused',
  playbackStarted: new Date(),
  timeSinceStart: 0,
};

export const playerReducer: Reducer<PlayerState, PlayerActions> = (
  state = initialState,
  action,
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(togglePlayback):
        if (state.playback === 'playing') {
          draft.playback = 'paused';
          draft.timeSinceStart = new Date().getTime() - state.playbackStarted.getTime();
          console.log("Playback paused");
        } else {
          draft.playback = 'playing';
          draft.playbackStarted = new Date(
            new Date().getTime() - draft.timeSinceStart,
          );
          console.log("Playback started");
        }
        break;
      case getType(resetPlayback):
        console.log('resetting playback time');
        draft.timeSinceStart = 0;
        draft.playbackStarted = new Date();
        draft.playback = 'paused';
        break;
      case getType(setTime):
        // console.log(action.payload);
        draft.timeSinceStart = action.payload;
        break;
    }
  });
