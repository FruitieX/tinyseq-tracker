import styled from 'styled-components';
import * as React from 'react';
import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { addPattern, removePattern, editPattern } from '../state/song';
import { Song, Instrument } from '../types/instrument';
import { DeepReadonly } from 'utility-types';
import { changePattern } from '../state/editor';
import {
  baseButton,
  baseInput,
  BaseInputProps,
  gridCell,
  GridCellProps,
  borderStyle,
  border,
} from '../utils/styles';

const PatternContainer = styled.div`
  display: grid;
  align-self: start;
  grid-gap: 8px;
`;

const PatternArea = styled.div`
  grid-area: patterns;
  overflow: auto;
`;

const CellWrapper = styled.div`
  ${gridCell};
  ${borderStyle};

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface InputProps extends BaseInputProps {}

const SelectPatternInput = styled.input<InputProps>`
  ${baseInput};

  border-top: none;
  border-bottom: none;

  height: 24px;
  max-width: 48px;

  text-align: center;
`;

const SelectPatternButton = styled.button`
  ${baseButton};

  height: 24px;
  border: none;

  text-align: center;
`;

const AddRemovePatternButton = styled.button`
  ${baseButton};

  height: 24px;
  border: none;

  &:last-child {
    border-left: ${border};
  }

  flex: 1;
`;

interface Props {
  loadedSong: DeepReadonly<Song>;
  addPattern: typeof addPattern;
  removePattern: typeof removePattern;
  editPattern: typeof editPattern;
  currentPattern: number;
  changePattern: typeof changePattern;
}

class PatternWrapper extends React.Component<Props> {
  handlePatternChange = (trackId: number, patternId: number, value: number) => {
    if (value < 0) return;

    if (value < this.props.loadedSong[trackId].patterns.length) {
      this.props.editPattern({
        trackId,
        patternId,
        value,
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
  };

  handlePatternInputChange = (trackId: number, patternId: number) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value);

    if (isNaN(value)) return;

    this.handlePatternChange(trackId, patternId, value);
  };

  handleAddPatternButton = (trackId: number) => (
    event: React.MouseEvent<HTMLButtonElement>,
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

  handleRemovePattern = (trackId: number) => () => {
    this.props.removePattern({
      trackId,
    });
  };

  handleClick = (patternIndex: number) => {
    // set current pattern to the pattern index that that was clicked on
    this.props.changePattern({ pattern: patternIndex });
  };

  incrementPattern = (
    trackId: number,
    patternIndex: number,
    offset: number,
  ) => () =>
    this.handlePatternChange(
      trackId,
      patternIndex,
      this.props.loadedSong[trackId].patterns[patternIndex] + offset,
    );

  renderTrack = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return instrument.patterns.map((pattern, patternIndex) => (
      <CellWrapper
        key={trackId.toString() + patternIndex.toString()}
        x={trackId}
        y={patternIndex}
      >
        <SelectPatternButton
          onClick={this.incrementPattern(trackId, patternIndex, -1)}
        >{`-`}</SelectPatternButton>
        <SelectPatternInput
          active={this.props.currentPattern === patternIndex}
          value={pattern}
          onChange={this.handlePatternInputChange(trackId, patternIndex)}
          onClick={e => this.handleClick(patternIndex)}
        />
        <SelectPatternButton
          onClick={this.incrementPattern(trackId, patternIndex, +1)}
        >{`+`}</SelectPatternButton>
      </CellWrapper>
    ));
  };

  renderButtons = (instrument: DeepReadonly<Instrument>, trackId: number) => {
    return (
      <CellWrapper
        x={trackId}
        y={instrument.patterns.length}
        key={'b' + trackId.toString()}
      >
        <AddRemovePatternButton
          type="button"
          onClick={this.handleRemovePattern(trackId)}
        >
          {`-`}
        </AddRemovePatternButton>
        <AddRemovePatternButton
          type="button"
          onClick={this.handleAddPatternButton(trackId)}
        >
          {`+`}
        </AddRemovePatternButton>
      </CellWrapper>
    );
  };

  render() {
    return (
      <PatternArea>
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
  removePattern,
  changePattern,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatternWrapper);
