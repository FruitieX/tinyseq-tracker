import React from 'react';
import styled from 'styled-components';
import { Instrument } from '../types/instrument';

const TrackContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

interface Props {
  index: number;
  instrument: Instrument;
}

const NoteContainer = styled.div`
  font-family: monospace;
`;

const getNoteName = (noteCode: number): string => {
  switch (noteCode) {
    case 0:
      return 'C-';
    case 1:
      return 'C#';
    case 2:
      return 'D-';
    case 3:
      return 'D#';
    case 4:
      return 'E-';
    case 5:
      return 'F-';
    case 6:
      return 'F#';
    case 7:
      return 'G-';
    case 8:
      return 'G#';
    case 9:
      return 'A-';
    case 10:
      return 'A#';
    case 11:
      return 'B-';
    default:
      throw new Error('No note name exists for noteCodes outside 0-11');
  }
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

const renderRow = (note: string, index: number) => {
  return <NoteContainer key={index}>{note}</NoteContainer>;
};

export class Track extends React.Component<Props> {
  render() {
    const { instrument } = this.props;
    return (
      <TrackContainer>
        {notesStringToArr(instrument.notes).map(renderRow)}
      </TrackContainer>
    );
  }
}
