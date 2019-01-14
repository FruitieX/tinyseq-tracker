import styled from 'styled-components';
import * as React from 'react';
import { RootState } from '../state/rootReducer';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { addPattern, editPattern } from '../state/song';
import { Song, Instrument, parseInstrument } from '../types/instrument';
import { DeepReadonly } from 'utility-types';

const Container = styled.div`
  grid-area: panel;
  display: grid;
  align-self: start;
  grid-gap: 4px;
`;

interface InputProps {
  x: number;
  y: number;
  active: boolean;
}

const Input = styled.input<InputProps>`
  grid-column: ${props => props.x + 1} / span 1;
  grid-row: ${props => props.y + 1} / span 1;
  max-width: 30px;
  max-height: 30px;
  background-color: ${props => props.active ? "red" : "white" };
`;

interface Props {
  loadedSong: DeepReadonly<Song>;
  addPattern: (trackId: number, notes: string) => void;
  editPattern:  (trackId: number, patternId: number, value: number) => void;
  currentPattern: number;
  setCurrentPattern: (value: number) => void;
}

class PatternWrapper extends React.Component<Props> {
  handleChange = (trackId: number, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) >= 0) {
      if (Number(event.target.value) < this.props.loadedSong[trackId].patterns.length) {
        this.props.editPattern(trackId, index, Number(event.target.value));
      } else {
        // add empty pattern to last place
        this.props.addPattern(trackId, Array(this.props.loadedSong[trackId].notes[this.props.loadedSong[trackId].notes.length - 1].length + 1).join(" "));
        // put the current input field value to the created pattern index value
        this.props.editPattern(trackId, index, this.props.loadedSong[trackId].patterns.length);
      }
    }
  }

  handleClick = (patternIndex: number, trackId: number, event: React.MouseEvent<HTMLInputElement>) => {
    // set current pattern to the pattern index that that was clicked on
    this.props.setCurrentPattern(patternIndex);
  }

  renderTrack = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return instrument.patterns.map((pattern, patternIndex) =>
      <Input x={trackId} y={patternIndex} active={this.props.currentPattern === patternIndex} type="number" key={patternIndex} value={pattern} onChange={this.handleChange(trackId, patternIndex)} onClick={(e) => this.handleClick(patternIndex, trackId, e)} />
    )
  }

  render() {
    return (
      <Container>
        {this.props.loadedSong.map(this.renderTrack)}
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  editPattern: (trackId: number, patternId: number, value: number) => dispatch(editPattern({
    trackId,
    patternId,
    value
  })),
  addPattern: (trackId: number, notes: string) => dispatch(addPattern({
    trackId,
    notes
  }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatternWrapper);