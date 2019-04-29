import { observable, action } from 'mobx';
import { InstrumentInstance } from '../types/instrument';

// terrible globals for demo
if ((process as any).browser) {
  (window as any).playbackStarted = 0;
  (window as any).timeSinceStart = 0;
  (window as any).playback = 'paused';
}

export type PlaybackState = 'playing' | 'paused';

class PlayerState {
  @observable
  instrumentInstances: InstrumentInstance[] = [];

  @observable
  playback: PlaybackState = 'paused';

  @observable
  playbackStarted = new Date().getTime();

  @observable
  timeSinceStart = 0;

  @action
  setInstrumentInstances = (instrumentInstances: InstrumentInstance[]) => {
    this.instrumentInstances = instrumentInstances;
  };

  @action
  togglePlayback = () => {
    if (this.playback === 'playing') {
      this.playback = 'paused';

      const timeSinceStart = new Date().getTime() - this.playbackStarted;
      this.timeSinceStart = timeSinceStart;

      console.log('Playback paused');

      // terrible globals for demo
      (window as any).timeSinceStart = timeSinceStart;
      (window as any).playback = 'paused';
    } else {
      this.playback = 'playing';

      const playbackStarted = new Date().getTime() - this.timeSinceStart;
      this.playbackStarted = playbackStarted;

      console.log('Playback started');

      // terrible globals for demo
      (window as any).playbackStarted = playbackStarted;
      (window as any).playback = 'playing';
    }
  };

  @action
  resetPlayback = () => {
    console.log('resetting playback time');
    this.timeSinceStart = 0;
    const playbackStarted = new Date().getTime();
    this.playbackStarted = playbackStarted;
    this.playback = 'paused';

    // terrible globals for demo
    (window as any).timeSinceStart = 0;
    (window as any).playbackStarted = playbackStarted;
    (window as any).playback = 'paused';
  };

  @action
  setTime = (t: number) => {
    // console.log(action.payload);
    this.timeSinceStart = t;

    // terrible globals for demo
    (window as any).timeSinceStart = t;
  };
}

export const playerState = new PlayerState();
