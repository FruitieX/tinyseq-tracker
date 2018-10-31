type WaveformFunction = string;
type Notes = string;
type SecondsPerRow = number;
type RowsPerPattern = number;
type Transpose = number;
type Volume = number;
type Attack = number;
type Decay = number;
type Sustain = number;
type Release = number;

export type TSInstrument = [
  WaveformFunction,
  Notes,
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
  rowDuration: tsInstrument[2],
  patternRows: tsInstrument[3],
  transpose: tsInstrument[4],
  volume: tsInstrument[5],
  attack: tsInstrument[6],
  decay: tsInstrument[7],
  sustain: tsInstrument[8],
  release: tsInstrument[9],
});

export const parseSong = (tsSong: TSSong): Song => tsSong.map(parseInstrument);
