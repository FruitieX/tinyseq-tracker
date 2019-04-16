import React from 'react';
import { Instrument } from '../types/instrument';

import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { noteCharToSound } from './Track';

interface Props {
  instruments: Instrument[];
  currentTrack: number;
}

interface State {
  instrumentInstance?: InstrumentInstance;
  instrumentInstances?: InstrumentInstance[];
  loadedInstruments?: Instrument[];
}

// TODO: put these in config
const I_WAVEFORM = 0;
const I_TRANSPOSE = 1;
const I_NOTES = 2;
const I_SECONDS_PER_ROW = 3;
const I_VOLUME = 4;
const I_ATTACK = 5;
const I_DECAY = 6;
const I_SUSTAIN = 7;
const I_RELEASE = 8;

export interface InstrumentInstance {
  ctx: AudioContext;
  node: AudioWorkletNode;
  instrument: Instrument;
}

export const initInstrument = async (
  instrument: Instrument,
): Promise<InstrumentInstance> => {
  console.log('initializing instrument', instrument);

  const ctx = new AudioContext();

  const instrumentIndex = 0;

  const node = await ctx.audioWorklet
    .addModule(
      URL.createObjectURL(
        new Blob(
          [
            // TODO: minify this js automatically?
            // A.sR = A.sampleRate

            // parameters used:
            // e: envelope
            // f: note frequency
            // n: note start time
            `let s=0;registerProcessor(${instrumentIndex},class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:'f'},{name:'e'},{name:'n'}]}process(i,[[o]],p){return!!o.map((_,i,o,t=s++/${
              ctx.sampleRate
            },f=p.f[0],e=p.e[0],n=t-p.n[0])=>o[i]=${instrument.waveform}*e)}})`,
          ],
          { type: 'text/jscript' },
        ),
        /*
        new Blob(
          [
            `registerProcessor(0, class extends AudioWorkletProcessor{
              static get parameterDescriptors(){return[{name:'f'},{name:'e'},{name:'n'}]}
                process(i, [[o]]) {
                  return!!o.map((_, i) => o[i] = Math.random());
                }
              })`,
          ],
          { type: 'text/jscript' },
        ),
        */
      ),
    )
    .then(() => {
      const lowpass = ctx.createBiquadFilter();

      // low pass filter to hopefully fix weird aliasing crap?
      lowpass.frequency.setValueAtTime(10000, 0);

      const node = new AudioWorkletNode(
        ctx,
        (instrumentIndex as any) as string,
      );
      node.connect(lowpass).connect(ctx.destination);

      return node;
    });

  return {
    ctx,
    node,
    instrument,
  };
};

export const playNote = (
  instrumentInstance: InstrumentInstance,
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

export class InstrumentManager extends React.Component<Props, State> {
  state: State = {};

  refreshInstruments = async () => {
    console.log('refreshing instruments');
    if (this.state.instrumentInstances) {
      this.state.instrumentInstances.map(i => i.ctx.close());
    }

    // clean, beautiful global variables
    (window as any).i = [];

    const instruments = this.props.instruments;

    if (!instruments) return;

    const instrumentInstances = await Promise.all(
      instruments.map(initInstrument),
    );
    (window as any).i = instrumentInstances;

    this.setState(() => ({
      instrumentInstances: instrumentInstances,
      loadedInstruments: instruments,
    }));
  };

  componentDidMount() {
    this.refreshInstruments();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.currentTrack !== this.props.currentTrack) {
      this.setState(() => ({
        instrumentInstance:
          this.state.instrumentInstances === undefined
            ? undefined
            : this.state.instrumentInstances[this.props.currentTrack],
      }));
    }
  }

  playNotes = (notes: string[]) => {
    console.log('playing notes ', ...notes);

    const instrumentInstances = this.state.instrumentInstances;

    if (!instrumentInstances) return;

    notes.forEach((n, i) =>
      playNote(instrumentInstances[i], noteCharToSound(n) - 33),
    );
  };

  render() {
    return null;
  }
}

const mapStateToProps = (state: RootState) => ({
  instruments: state.song.loaded,
  currentTrack: state.editor.track,
  playback: state.player.playback,
  playbackStarted: state.player.playbackStarted,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(InstrumentManager);
