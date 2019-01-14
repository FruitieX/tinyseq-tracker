import styled from 'styled-components';
import * as React from 'react';
import { RootState } from '../state/rootReducer';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { editPattern } from '../state/song';
import { Song, Instrument } from '../types/instrument';
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
  editPattern:  (trackId: number, patternId: number, value: number) => void;
  currentPattern: number;
  setCurrentPattern: (value: number) => void;
}

class PatternWrapper extends React.Component<Props> {
  handleChange = (trackId: number, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.editPattern(trackId, index, Number(event.target.value));
  }

  handleClick = (value: number, event: React.MouseEvent<HTMLInputElement>) => {
    this.props.setCurrentPattern(value);
  }

  renderTrack = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return instrument.patterns.map((pattern, patternIndex) =>
      <Input x={trackId} y={patternIndex} active={this.props.currentPattern === patternIndex} type="number" key={patternIndex} value={pattern} onChange={this.handleChange(trackId, patternIndex)} onClick={(e) => this.handleClick(patternIndex, e)} />
    )
  }

  render() {
    // console.log(this.props.loadedSong)
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
  }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatternWrapper);
