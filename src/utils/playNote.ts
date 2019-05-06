import { InstrumentInstance } from '../types/instrument';

export const playNote = (
  instrumentInstance: InstrumentInstance | undefined,
  note: number,
) => {
  if (!instrumentInstance)
    return console.warn('no instrumentInstance passed to playNote!');

  const instrument = instrumentInstance.instrument;

  // little override to make TSC happy, there's probably a correct way of doing this
  const node = instrumentInstance.node as AudioWorkletNode & {
    parameters: { get: (name: string) => AudioParam };
  };

  // Current note
  //N = n.charCodeAt() - 33;
  const N = note;

  // Whitespace (dec 32) means hold previous note
  if (N < 0) return;

  // Note start time = now
  const t = instrumentInstance.ctx.currentTime;

  // ADSR envelope helper function
  const ADSR = (
    param: AudioParam,
    from: number,
    to?: number,
    time?: number,
  ) => {
    // First cancel any scheduled value changes
    param.cancelAndHoldAtTime(t + 0.001);

    // Value starts at from value, first fade old value to 'from' to avoid clicking
    time && param.setTargetAtTime(from, t, 0.001);
    param.setValueAtTime(from, t + 0.003); // wtf, why do we get clicking if this matches above value

    // Fade toward to value if time parameter was given
    time && param.linearRampToValueAtTime(to!, /*(t += time)*/ time);
  };

  // Exclamation mark (dec 33) means release previous note
  if (!N)
    return ADSR(
      node.parameters.get('e'),
      instrument.volume * instrument.sustain,
      0,
      instrument.release,
    );

  // Instantly set new frequency
  ADSR(
    node.parameters.get('f'),
    440 * Math.pow(2, (3 + N - instrument.transpose) / 12),
  );

  // Note start time
  node.parameters.get('n').setValueAtTime(t, t);

  // Attack
  ADSR(node.parameters.get('e'), 0, instrument.volume, t + instrument.attack);

  // Decay
  ADSR(
    node.parameters.get('e'),
    instrument.volume,
    instrument.volume * instrument.sustain,
    t + instrument.attack + instrument.decay,
  );

  // Sustain
  // ADSR(node.parameters.get('e'), instrument.volume * instrument.sustain);
};
