import { _DeepReadonlyArray } from "utility-types/dist/mapped-types";

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

export const patternLength = (notes: String, secsPerRow: number): number => {
  // console.log(notes, secsPerRow);
  if (notes === undefined) return 0;
  return notes.length * secsPerRow * 1000;
}

export const timeFromBeginning = (song: _DeepReadonlyArray<Instrument>, trackIndex: number, patternIndex: number, noteIndex: number): number => {
  let time = 0;
  let i = song[trackIndex];
  // add the time from previous patterns
  for (let p = 0; p < patternIndex; p++) {
    let pat = i.patterns[p];
    // if pat = 0, then the current pattern in this track is empty.
    // in this case, find the longest pattern from the other instruments (current patternIndex)
    if (pat === 0) {
      let maxLengths = song.map(i => patternLength(i.notes[i.patterns[p] - 1], i.rowDuration));
      time += Math.max(...maxLengths);
    } else {
      time += patternLength(i.notes[pat - 1], i.rowDuration);
}
  }
  // calculate time in current pattern
  time += noteIndex * i.rowDuration * 1000;
  return time;
}

export type Song = Instrument[];

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

export const defaultInstrument: Instrument = {
  waveform: 'Math.random()',
  notes: ['                '],
  patterns: [1],
  rowDuration: 0.5,
  rowsPerPattern: 32,
  transpose: 0,
  volume: 1,
  attack: 0,
  decay: 0,
  sustain: 0,
  release: 0,
};

export const parseSong = (tsSong: TSSong): Song => tsSong.map(parseInstrument);
