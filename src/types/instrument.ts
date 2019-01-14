type WaveformFunction = string;
type Notes = string[];
type Patterns = number[];
type SecondsPerRow = number[];
type RowsPerPattern = number[];
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
  RowsPerPattern,
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
  patternRows: RowsPerPattern;
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
  patternRows: tsInstrument[4],
  transpose: tsInstrument[5],
  volume: tsInstrument[6],
  attack: tsInstrument[7],
  decay: tsInstrument[8],
  sustain: tsInstrument[9],
  release: tsInstrument[10],
});

export const parseSong = (tsSong: TSSong): Song => tsSong.map(parseInstrument);
