import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import { Instrument, parseSong, TSSong } from '../types/instrument';
import { Track } from './Track';

const NoteEditor = styled.div`
  display: flex;
  flex-direction: row;
`;

const renderTrack = (instrument: Instrument, index: number) => {
  return <Track key={index} index={index} instrument={instrument} />;
};

export default class Editor extends React.Component {
  render() {
    return (
      <NoteEditor>{parseSong(song as TSSong).map(renderTrack)}</NoteEditor>
    );
  }
}
