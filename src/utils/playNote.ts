import { InstrumentInstance } from '../types/instrument';

export const playNote = (
  instrumentInstance: InstrumentInstance | undefined,
  N: number,
) => {
  if (!instrumentInstance)
    return console.warn('no instrumentInstance passed to playNote!');

  const instrument = instrumentInstance.instrument;

  // little override to make TSC happy, there's probably a correct way of doing this
  const node = instrumentInstance.node as AudioWorkletNode & {
    parameters: { get: (name: string) => AudioParam };
  };

  // Whitespace (dec 32) means hold previous note
  if (N < 0) return;

  // Note start time = now
  const t = instrumentInstance.ctx.currentTime;
  const f = node.parameters.get('f');
  const e = node.parameters.get('e');

  // Exclamation mark (dec 33) means release previous note
  if (!N) {
    // Release
    e.cancelAndHoldAtTime(t); // Cancel any future commands and hold
    e.linearRampToValueAtTime(0, t + instrument.release);
    // e.setValueAtTime(0, t + instrument.release);
  } else {
    const delta = 0.01;

    // Set frequency
    f.cancelAndHoldAtTime(t); // Cancel any future commands and hold
    f.setValueAtTime(
      440 * Math.pow(2, (3 + N - instrument.transpose) / 12),
      t + delta, // Change frequency exactly when envelope hits zero volume to avoid popping
    );

    // Store note start time
    node.parameters.get('n').setValueAtTime(t, t);

    // Envelope starts from 0
    e.cancelAndHoldAtTime(t); // Cancel any future commands and hold
    e.linearRampToValueAtTime(0, t + delta); // Quickly fades to 0 to avoid popping

    // Attack
    e.linearRampToValueAtTime(instrument.volume, t + delta + instrument.attack);

    // Decay & Sustain
    e.linearRampToValueAtTime(
      instrument.volume * instrument.sustain,
      t + instrument.attack + delta + instrument.decay,
    );
  }
};
