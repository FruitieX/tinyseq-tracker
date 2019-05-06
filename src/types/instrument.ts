import { _DeepReadonlyArray } from 'utility-types/dist/mapped-types';

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

export interface InstrumentInstance {
  ctx: AudioContext;
  node: AudioWorkletNode;
  instrument: Instrument;
}

export const patternLength = (notes: String, secsPerRow: number): number => {
  // console.log(notes, secsPerRow);
  if (notes === undefined) return 0;
  return notes.length * secsPerRow * 1000;
};

export const timeFromBeginning = (
  song: _DeepReadonlyArray<Instrument>,
  trackIndex: number,
  patternIndex: number,
  noteIndex: number,
): number => {
  let time = 0;
  let i = song[trackIndex];

  if (!i) return 0;

  // add the time from previous patterns
  for (let pi = 0; pi < patternIndex; pi++) {
    let pat = i.patterns[pi];
    // if pat = 0, then the current pattern in this track is empty.
    // in this case, find the longest pattern from the other instruments (current patternIndex)
    if (pat === 0) {
      let maxLengths = song.map(i =>
        patternLength(i.notes[i.patterns[pi] - 1], i.rowDuration),
      );
      time += Math.max(...maxLengths);
    } else {
      time += patternLength(i.notes[pat - 1], i.rowDuration);
    }
  }
  // calculate time in current pattern
  time += noteIndex * i.rowDuration * 1000;
  return time;
};

export const getRowFromPattern = (
  notes: String,
  secsPerRow: number,
  time: number,
): number => {
  return Math.floor((time / (notes.length * secsPerRow * 1000)) * notes.length);
};

export interface InstrumentPos {
  track: number;
  pattern: number;
  row: number;
}

export const nextRow = (
  instrument: Instrument,
  patternIndex: number,
  rowNumber: number,
) => {
  if (
    instrument.notes[instrument.patterns[patternIndex] - 1].length < rowNumber
  )
    return { patternIndex: patternIndex + 1, rowNumber: 0 };
  else return { patternIndex: patternIndex, rowNumber: rowNumber + 1 };
};

export const previousRow = (
  instrument: Instrument,
  patternIndex: number,
  rowNumber: number,
) => {
  if (rowNumber === 0)
    return {
      patternIndex: patternIndex - 1,
      rowNumber:
        instrument.notes[instrument.patterns[patternIndex - 1] - 1].length,
    };
  else return { patternIndex: patternIndex, rowNumber: rowNumber - 1 };
};

export const time2instrumentPos = (
  time: number,
  song: Song,
  track: number,
): InstrumentPos => {
  let i = song[track]; // current instrument
  let secsPerRow = i.rowDuration;
  let sumTime = 0;
  for (let pi = 0; sumTime < time; pi++) {
    let pattern = i.patterns[pi];
    // if (pattern === 0) {
    //   let maxLength = Math.max(...song.map(i => patternLength(i.notes[i.patterns[pi] - 1], i.rowDuration)));
    //   if (time < sumTime + maxLength) {
    //     return {track: undefined, patternIndex: pi, row: undefined};
    //   } else {
    //     sumTime += maxLength;
    //   }
    // } else {
    let notes = i.notes[pattern - 1];
    let plength = patternLength(notes, secsPerRow);
    // if time is in current pattern, get row position in current pattern
    if (time < sumTime + plength) {
      return {
        track: 0,
        pattern: pi,
        row: getRowFromPattern(notes, secsPerRow, time - sumTime),
      };
    } else {
      // if not, add current pattern length to sumTime and go to next iteration
      sumTime += plength;
    }
    // }
  }
  return { track: 0, pattern: 0, row: 0 };
};

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

export const getSongLength = (song: Song): number => {
  let sumTime = 0;
  let numPatterns = Math.max(...song.map(i => i.patterns.length));
  for (let p = 0; p < numPatterns; p++) {
    sumTime += Math.max(
      ...song.map(i =>
        patternLength(i.notes[i.patterns[p] - 1], i.rowDuration),
      ),
    );
  }
  return sumTime;
};
