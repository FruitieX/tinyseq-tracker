import React from 'react';
import styled from 'styled-components';

import song from '../../song.json';
import { Instrument, parseSong, TSSong, Song } from '../types/instrument';
import { Track } from './Track';
import SoundFactory from './SoundFactory';

import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { setSong } from '../state/song';
import { Dispatch } from 'redux';
import { DeepReadonly } from 'utility-types';

const NoteEditor = styled.div`
  grid-area: main-editor;
  display: flex;
  flex-direction: row;
  user-select: none;
`;

const TrackerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr 3fr;
  grid-template-rows: 150px 6fr 2fr;
  height: 100vh;
  grid-template-areas:
    'panel header right-top'
    'panel main-editor right-top'
    'panel footer right-bottom';
`;

const PatternWrapper = styled.div`
  grid-area: panel;
`;

const GraphWrapper = styled.div`
  grid-area: header;
`;

interface EditorProps {
  loadedSong: DeepReadonly<Song>;
  loadSong: (song: Song) => void;
}

interface EditorState {
  selectedLine: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      selectedLine: 0,
    };
  }

  componentDidMount() {
    this.props.loadSong(parseSong(song as TSSong));
  }

  renderTrack = (instrument: Instrument, index: number) => {
    return <Track key={index} index={index} instrument={instrument} />;
  };

  render() {
    return (
      <TrackerWrapper>
        <PatternWrapper>Pootis patterns here</PatternWrapper>
        <GraphWrapper />
        <NoteEditor>{this.props.loadedSong.map(this.renderTrack)}</NoteEditor>
        <SoundFactory />
      </TrackerWrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadSong: (song: Song) => dispatch(setSong(song)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
