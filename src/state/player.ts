import { createStandardAction, ActionType, getType } from 'typesafe-actions';
import { Reducer } from 'redux';
import { DeepReadonly } from 'utility-types';
import produce from 'immer';

export const togglePlayback = createStandardAction(
  'playback/TOGGLE_PLAYBACK',
)();

const actions = { togglePlayback };
export type PlayerActions = ActionType<typeof actions>;

export type PlaybackState = 'playing' | 'paused';

export type PlayerState = DeepReadonly<{
  playback: PlaybackState;
  playbackStarted: Date; // unix timestamp in ms
}>;

const initialState: PlayerState = {
  playback: 'paused',
  playbackStarted: new Date(),
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
          draft.playbackStarted = new Date();
        }
        break;
    }
  });
