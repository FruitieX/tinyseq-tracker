type WaveformFunction = string;
type Notes = string[];
type Patterns = number[];
type SecondsPerRow = number; // TODO: make these number arrays again
type Rows = number; // TODO: make these number arrays again
type Transpose = number;
type Volume = number;
type Attack = number;
type Decay = number;
type Sustain = number;
type Release = number;

export type TSInstrument = [
  WaveformFunction,
  Notes,
  Patterns,
  SecondsPerRow,
  Rows,
  Transpose,
  Volume,
  Attack,
  Decay,
  Sustain,
  Release
];

export type TSSong = TSInstrument[];

export interface Instrument {
  waveform: WaveformFunction;
  notes: Notes;
  patterns: Patterns;
  rowDuration: SecondsPerRow;
  rowsPerPattern: Rows;
  transpose: Transpose;
  volume: Volume;
  attack: Attack;
  decay: Decay;
  sustain: Sustain;
  release: Release;
}

export type Song = Instrument[];

export const parseInstrument = (tsInstrument: TSInstrument): Instrument => ({
  waveform: tsInstrument[0],
  notes: tsInstrument[1],
  patterns: tsInstrument[2],
  rowDuration: tsInstrument[3],
  rowsPerPattern: tsInstrument[4],
  transpose: tsInstrument[5],
  volume: tsInstrument[6],
  attack: tsInstrument[7],
  decay: tsInstrument[8],
  sustain: tsInstrument[9],
  release: tsInstrument[10],
});

export const defaultInstrument: Instrument = ({
  waveform: "Math.random()",
  notes: ["                "],
  patterns: [0],
  rowDuration: .5,
  rowsPerPattern: 32,
  transpose: 0,
  volume: 1,
  attack: 0,
  decay: 0,
  sustain: 0,
  release: 0,
});

export const parseSong = (tsSong: TSSong): Song => tsSong.map(parseInstrument);
