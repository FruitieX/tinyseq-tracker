import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import { Instrument, parseSong, TSSong, Song } from '../types/instrument';
import { Track } from './Track';

const NoteEditor = styled.div`
  display: flex;
  flex-direction: row;
  user-select: none;
`;

interface EditorProps {}

interface EditorState {
  selectedLine: number;
  song: Song;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      selectedLine: 0,
      song: parseSong(song as TSSong),
    };
  }

  renderTrack = (instrument: Instrument, index: number) => {
    return <Track key={index} index={index} instrument={instrument} />;
  };

  render() {
    return <NoteEditor>{this.state.song.map(this.renderTrack)}</NoteEditor>;
  }
}
