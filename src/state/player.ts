import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import produce from 'immer';

export const togglePlayback = createStandardAction(
  'playback/TOGGLE_PLAYBACK',
)();
export const resetPlayback = createStandardAction('playback/RESET_PLAYBACK')();
export const updateTime = createStandardAction('playback/UPDATE_TIME')();

const actions = { togglePlayback, resetPlayback, updateTime };
export type PlayerActions = ActionType<typeof actions>;

export type PlaybackState = 'playing' | 'paused';

export type PlayerState = DeepReadonly<{
  playback: PlaybackState;
  playbackStarted: Date; // unix timestamp in ms
  timeSinceStart: number;
}>;

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
        } else {
          draft.playback = 'playing';
          draft.playbackStarted = new Date(
            new Date().getTime() - draft.timeSinceStart,
          );
        }
        break;
      case getType(resetPlayback):
        console.log('resetting playback');
        draft.timeSinceStart = 0;
        draft.playbackStarted = new Date();
        // draft.playback = 'paused';
        break;
      case getType(updateTime):
        draft.timeSinceStart =
          new Date().getTime() - draft.playbackStarted.getTime();

        // console.log("updating time to " + draft.timeSinceStart);
        break;
    }
  });
