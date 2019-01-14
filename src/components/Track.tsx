import React from 'react';
import styled from 'styled-components';
import { Instrument } from '../types/instrument';
import { string } from 'prop-types';

const TrackContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

interface Props {
  index: number;
  instrument: Instrument;
  selected: boolean;
  selectedRow: number;
  onClickNote: (trackIndex: number, rowIndex: number) => void;
  currentPattern: number;
}

interface INoteContainerProps {
  selected: boolean;
}
const NoteContainer = styled.div<INoteContainerProps>`
  color: ${props => (props.selected ? '#000' : 'inherit')};
  background-color: ${props => (props.selected ? '#f52' : 'inherit')};
  text-align: center;
`;

interface Code2Note{
  [key: string]: string;
};

const code2note:Code2Note = {
  0: 'C-',
  1: 'C#',
  2: 'D-',
  3: 'D#',
  4: 'E-',
  5: 'F-',
  6: 'F#',
  7: 'G-',
  8: 'G#',
  9: 'A-',
  10: 'A#',
  11: 'B-'
};

const getNoteName = (noteCode: number): string => {
  if (code2note[noteCode] === undefined) {throw new Error('No note name exists for noteCodes outside 0-11')};
  return code2note[noteCode];
};

const noteCodeToString = (noteCode: number): string => {
  const transpose = Math.floor(noteCode / 12);
  const note = noteCode % 12;

  return `${getNoteName(note)}${transpose}`;
};

const noteCharToString = (note: string): string => {
  switch (note) {
    case ' ':
      return '---';
    case '!':
      return 'OFF';
    default: {
      return noteCodeToString(note.charCodeAt(0) - 35);
    }
  }
};

const notesStringToArr = (notes: string): string[] => {
  return notes.split('').map(noteCharToString);
};

export class Track extends React.Component<Props> {
  handleClick = (rowIndex: number) => () => {
    this.props.onClickNote(this.props.index, rowIndex);
  }

  renderRow = (note: string, index: number) => {
    return (
      <NoteContainer
        key={index}
        selected={this.props.selected && this.props.selectedRow === index}
        onClick={this.handleClick(index)}
      >
        {note}
      </NoteContainer>
    );
  };

  render() {
    const { instrument } = this.props;
    return (
      <TrackContainer>
        <div className="track-name"><h3>Track</h3><p>{this.props.index}</p></div>
        {notesStringToArr(instrument.notes[instrument.patterns[this.props.currentPattern]]).map(this.renderRow)}
      </TrackContainer>
    );
  }
}
