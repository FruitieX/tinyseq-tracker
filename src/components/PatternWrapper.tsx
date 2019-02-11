import styled from 'styled-components';
import * as React from 'react';
import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { addPattern, editPattern } from '../state/song';
import { Song, Instrument, parseInstrument } from '../types/instrument';
import { DeepReadonly } from 'utility-types';
import { changePattern } from '../state/editor';

const PatternContainer = styled.div`
  display: grid;
  align-self: start;
  grid-gap: 4px;
  input {
    border: 1px solid gray;
  }
`;

const PatternArea = styled.div`
  grid-area: panel;
  overflow: auto;
  h3 {
    text-align: center;
  }
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
  background-color: ${props => (props.active ? 'blue' : 'Transparent')};
  color: white;
`;

const AddPatternInput = styled.input<InputProps>`
  grid-column: ${props => props.x + 1} / span 1;
  grid-row: ${props => props.y + 1} / span 1;
  max-width: 30px;
  max-height: 30px;
  background-color: Transparent;
  &:hover {
    background-color: green;
  }
`;

interface Props {
  loadedSong: DeepReadonly<Song>;
  addPattern: typeof addPattern;
  editPattern: typeof editPattern;
  currentPattern: number;
  changePattern: typeof changePattern;
}

class PatternWrapper extends React.Component<Props> {
  handleChange = (trackId: number, patternId: number) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (parseInt(event.target.value) != NaN) {
      if (parseInt(event.target.value) >= 0) {
        if (
          parseInt(event.target.value) <
          this.props.loadedSong[trackId].patterns.length
        ) {
          this.props.editPattern({
            trackId,
            patternId,
            value: parseInt(event.target.value),
          });
        } else {
          // add empty pattern to last place
          this.props.addPattern({
            trackId,
            notes: Array(
              this.props.loadedSong[trackId].notes[
                this.props.loadedSong[trackId].notes.length - 1
              ].length + 1,
            ).join(' '),
          });
          // put the current input field value to the created pattern index value
          this.props.editPattern({
            trackId,
            patternId,
            value: this.props.loadedSong[trackId].patterns.length,
          });
        }
      }
    }
  };

  handleAddPatternButton = (trackId: number) => (
    event: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (event.shiftKey) {
      // copy the previous pattern to last place
      this.props.addPattern({
        trackId,
        notes: this.props.loadedSong[trackId].notes[this.props.currentPattern],
      });
    } else {
      // add empty pattern to last place
      this.props.addPattern({
        trackId,
        notes: Array(
          this.props.loadedSong[trackId].notes[
            this.props.loadedSong[trackId].notes.length - 1
          ].length + 1,
        ).join(' '),
      });
    }
  };

  handleClick = (
    patternIndex: number,
    trackId: number,
    event: React.MouseEvent<HTMLInputElement>,
  ) => {
    // set current pattern to the pattern index that that was clicked on
    this.props.changePattern({ pattern: patternIndex });
  };

  renderTrack = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return instrument.patterns.map((pattern, patternIndex) => (
      <Input
        x={trackId}
        y={patternIndex}
        active={this.props.currentPattern === patternIndex}
        type="number"
        key={trackId.toString() + patternIndex.toString()}
        value={pattern}
        onChange={this.handleChange(trackId, patternIndex)}
        onClick={e => this.handleClick(patternIndex, trackId, e)}
      />
    ));
  };

  renderButtons = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return (
      <AddPatternInput
        x={trackId}
        y={instrument.patterns.length}
        active={false}
        type="button"
        key={'b' + trackId.toString()}
        value="+"
        onClick={this.handleAddPatternButton(trackId)}
      />
    );
  };

  render() {
    return (
      <PatternArea>
        <h3>Patterns</h3>
        <PatternContainer>
          {this.props.loadedSong.map(this.renderTrack)}
          {this.props.loadedSong.map(this.renderButtons)}
        </PatternContainer>
      </PatternArea>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
  currentPattern: state.editor.pattern,
});

const mapDispatchToProps = {
  editPattern,
  addPattern,
  changePattern,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatternWrapper);
