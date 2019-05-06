import { observable, action } from 'mobx';
import { Song, Instrument } from '../types/instrument';

const strReplace = (str: string, index: number, character: string) =>
  str.slice(0, index) + character + str.slice(index + 1);

class SongState {
  @observable
  loaded: Song = [];

  @action
  addInstrument = (instrument: Instrument) => {
    this.loaded.push(instrument);
  };

  @action
  addPattern = (trackId: number, notes: string) => {
    this.loaded[trackId].notes.push(notes);
    this.loaded[trackId].patterns.push(this.loaded[trackId].notes.length - 1);
  };

  @action
  removePattern = (trackId: number) => {
    this.loaded[trackId].patterns.pop();
  };

  @action
  editPattern = (trackId: number, patternId: number, value: number) => {
    this.loaded[trackId].patterns[patternId] = value;
  };

  @action
  editNote = (
    trackIndex: number,
    rowIndex: number,
    patternIndex: number,
    note: string,
  ) => {
    this.loaded[trackIndex].notes[patternIndex] = strReplace(
      this.loaded[trackIndex].notes[patternIndex],
      rowIndex,
      note,
    );
  };

  @action
  editWaveform = (trackIndex: number, waveform: string) => {
    this.loaded[trackIndex].waveform = waveform;
  };

  @action
  setSong = (song: Song) => {
    console.log(song);
    this.loaded = song;
  };
}

export const songState = new SongState();
