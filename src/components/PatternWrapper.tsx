import styled from 'styled-components';
import * as React from 'react';
import { Instrument } from '../types/instrument';
import { DeepReadonly } from 'utility-types';
import {
  baseButton,
  baseInput,
  BaseInputProps,
  gridCell,
  borderStyle,
  border,
} from '../utils/styles';
import { observer } from 'mobx-react-lite';
import { songState } from '../state/song';
import { editorState } from '../state/editor';

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

const PatternWrapper: React.FunctionComponent = observer(() => {
  const handlePatternChange = (
    trackId: number,
    patternId: number,
    value: number,
  ) => {
    if (value < 0) return;

    if (value < songState.loaded[trackId].patterns.length) {
      songState.editPattern(trackId, patternId, value);
    } else {
      // add empty pattern to last place
      songState.addPattern(
        trackId,
        Array(
          songState.loaded[trackId].notes[
            songState.loaded[trackId].notes.length - 1
          ].length + 1,
        ).join(' '),
      );
      // put the current input field value to the created pattern index value
      songState.editPattern(
        trackId,
        patternId,
        songState.loaded[trackId].patterns.length,
      );
    }
  };

  const handlePatternInputChange = (trackId: number, patternId: number) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value);

    if (isNaN(value)) return;

    handlePatternChange(trackId, patternId, value);
  };

  const handleAddPatternButton = (trackId: number) => (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (event.shiftKey) {
      // copy the previous pattern to last place
      songState.addPattern(
        trackId,
        songState.loaded[trackId].notes[editorState.pattern],
      );
    } else {
      // add empty pattern to last place
      songState.addPattern(
        trackId,
        Array(
          songState.loaded[trackId].notes[
            songState.loaded[trackId].notes.length - 1
          ].length + 1,
        ).join(' '),
      );
    }
  };

  const handleRemovePattern = (trackId: number) => () => {
    songState.removePattern(trackId);
  };

  const handleClick = (patternIndex: number) => {
    // set current pattern to the pattern index that that was clicked on
    editorState.changePattern(patternIndex);
  };

  const incrementPattern = (
    trackId: number,
    patternIndex: number,
    offset: number,
  ) => () =>
    handlePatternChange(
      trackId,
      patternIndex,
      songState.loaded[trackId].patterns[patternIndex] + offset,
    );

  const renderTrack = (
    instrument: DeepReadonly<Instrument>,
    trackId: number,
  ) => {
    return instrument.patterns.map((pattern, patternIndex) => (
      <CellWrapper
        key={trackId.toString() + patternIndex.toString()}
        x={trackId}
        y={patternIndex}
      >
        <SelectPatternButton
          onClick={incrementPattern(trackId, patternIndex, -1)}
        >{`-`}</SelectPatternButton>
        <SelectPatternInput
          active={editorState.pattern === patternIndex}
          value={pattern}
          onChange={handlePatternInputChange(trackId, patternIndex)}
          onClick={() => handleClick(patternIndex)}
        />
        <SelectPatternButton
          onClick={incrementPattern(trackId, patternIndex, +1)}
        >{`+`}</SelectPatternButton>
      </CellWrapper>
    ));
  };

  const renderButtons = (
    instrument: DeepReadonly<Instrument>,
    trackId: number,
  ) => {
    return (
      <CellWrapper
        x={trackId}
        y={instrument.patterns.length}
        key={'b' + trackId.toString()}
      >
        <AddRemovePatternButton
          type="button"
          onClick={handleRemovePattern(trackId)}
        >
          {`-`}
        </AddRemovePatternButton>
        <AddRemovePatternButton
          type="button"
          onClick={handleAddPatternButton(trackId)}
        >
          {`+`}
        </AddRemovePatternButton>
      </CellWrapper>
    );
  };

  return (
    <PatternArea>
      <PatternContainer>
        {songState.loaded.map(renderTrack)}
        {songState.loaded.map(renderButtons)}
      </PatternContainer>
    </PatternArea>
  );
});

export default PatternWrapper;
