import { observable, action } from 'mobx';
import { Song, Instrument, InstrumentInstance } from '../types/instrument';

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
      lowpass.frequency.setValueAtTime(20000, 0);

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

class InstrumentsState {
  @observable
  instances: InstrumentInstance[] = [];

  @action
  refreshInstruments = async (song?: Song) => {
    console.log('refreshing instruments');
    this.instances.map(i => i.ctx.close());

    if (!song) return;

    const newInstances = await Promise.all(song.map(initInstrument));
    // clean, beautiful global variables
    (window as any).i = newInstances;

    this.instances = newInstances;
  };
}

export const instrumentsState = new InstrumentsState();
