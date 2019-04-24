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
  playbackStarted: number; // unix timestamp in ms
  timeSinceStart: number;
};

const initialState: PlayerState = {
  playback: 'paused',
  playbackStarted: new Date().getTime(),
  timeSinceStart: 0,
};

// terrible globals for demo
if ((process as any).browser) {
  (window as any).playbackStarted = 0;
  (window as any).timeSinceStart = 0;
  (window as any).playback = 'paused';
}

export const playerReducer: Reducer<PlayerState, PlayerActions> = (
  state = initialState,
  action,
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(togglePlayback):
        if (state.playback === 'playing') {
          draft.playback = 'paused';

          const timeSinceStart = new Date().getTime() - state.playbackStarted;
          draft.timeSinceStart = timeSinceStart;

          console.log('Playback paused');

          // terrible globals for demo
          (window as any).timeSinceStart = timeSinceStart;
          (window as any).playback = 'paused';
        } else {
          draft.playback = 'playing';

          const playbackStarted = new Date().getTime() - draft.timeSinceStart;
          draft.playbackStarted = playbackStarted;

          console.log('Playback started');

          // terrible globals for demo
          (window as any).playbackStarted = playbackStarted;
          (window as any).playback = 'playing';
        }
        break;
      case getType(resetPlayback): {
        console.log('resetting playback time');
        draft.timeSinceStart = 0;
        const playbackStarted = new Date().getTime();
        draft.playbackStarted = playbackStarted;
        draft.playback = 'paused';

        // terrible globals for demo
        (window as any).timeSinceStart = 0;
        (window as any).playbackStarted = playbackStarted;
        (window as any).playback = 'paused';
        break;
      }
      case getType(setTime): {
        // console.log(action.payload);
        draft.timeSinceStart = action.payload;

        // terrible globals for demo
        (window as any).timeSinceStart = action.payload;
        break;
      }
    }
  });
