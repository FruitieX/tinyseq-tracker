import React from 'react';
import styled from 'styled-components';
import { Instrument } from '../types/instrument';
import { colors } from '../utils/styles';

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
  rowActive: boolean;
}
const NoteContainer = styled.div<INoteContainerProps>`
  text-align: center;

  color: ${props =>
    props.selected
      ? colors.active.fg
      : props.rowActive
      ? colors.hover.fg
      : colors.inactive.fg};

  background-color: ${props =>
    props.selected
      ? colors.active.bg
      : props.rowActive
      ? colors.hover.bg
      : colors.inactive.bg};
`;

interface Code2Note {
  [key: string]: string;
}

const code2note: Code2Note = {
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
  11: 'B-',
};

const getNoteName = (noteCode: number): string => {
  if (code2note[noteCode] === undefined) {
    throw new Error('No note name exists for noteCodes outside 0-11');
  }
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

export const noteCharToSound = (note: string): number => {
  return note.charCodeAt(0);
};

const notesStringToArr = (notes: string): string[] => {
  return notes.split('').map(noteCharToString);
};

export class Track extends React.Component<Props> {
  getPattern = (instrument: Instrument): string[] => {
    if (instrument.patterns[this.props.currentPattern] > 0) {
      return notesStringToArr(
        instrument.notes[instrument.patterns[this.props.currentPattern] - 1],
      );
    }
    return [' '];
  };

  handleClick = (rowIndex: number) => () => {
    this.props.onClickNote(this.props.index, rowIndex);
  };

  renderRow = (note: string, index: number) => {
    return (
      <NoteContainer
        key={index}
        selected={this.props.selected && this.props.selectedRow === index}
        rowActive={this.props.selectedRow === index}
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
        <div className="track-name">
          <h3>Track</h3>
          <p>{this.props.index}</p>
        </div>
        {this.getPattern(instrument).map(this.renderRow)}
      </TrackContainer>
    );
  }
}

export default Track;
