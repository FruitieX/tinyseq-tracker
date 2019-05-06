import React from 'react';
import styled from 'styled-components';
import { songState } from '../state/song';
import { baseInput, baseButton, baseSlider } from '../utils/styles';
import { editorState } from '../state/editor';
import { observer } from 'mobx-react-lite';
import { instrumentsState } from '../state/instruments';

const SoundFactoryContainer = styled.div`
  grid-area: instruments;
`;

const Input = styled.input`
  ${baseInput};
`;

const SlideNumInput = styled.input`
  ${baseInput};
  width: 50px;
  padding: 0;
  padding-left: 5px;
  border: none;
  height: initial;
  &:focus {
    border: 1px solid gray;
    background: #666;
    height: 18px;
    padding-left: 4px;
  }
`;

const AddWaveButton = styled.input`
  ${baseButton};
  text-align: center;
  width: 120px;
`;

const InstrumentPropertyContainer = styled.div``;

const Slider = styled.input`
  ${baseSlider}
  width: 50px;
`;

export const SoundFactory: React.FunctionComponent = observer(() => {
  const handleInstrumentWaveformChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    songState.editWaveform(editorState.track, event.target.value);
  };

  const handleInstrumentPropertyChange = (
    key: 'volume' | 'attack' | 'sustain' | 'decay' | 'release',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    songState.editInstrumentProperty(
      editorState.track,
      key,
      parseFloat(event.target.value),
    );
  };

  React.useEffect(() => {
    try {
      new Function(songState.loaded[editorState.track].waveform);

      if (songState.loaded[editorState.track].waveform) {
        instrumentsState.refreshInstruments(songState.loaded);
      }
    } catch (e) {
      console.log('Invalid wave string.');
    }
  }, [
    songState.loaded[editorState.track] &&
      songState.loaded[editorState.track].waveform,
  ]);

  const getWaveform = () => {
    const row = songState.loaded[editorState.track];
    return row ? row.waveform : '';
  };

  const addSinusoid = () => {
    addWaveform('Math.sin(Math.PI*2*f*t)');
  };

  const addSawTooth = () => {
    addWaveform('1-((f*t)%1)*2');
  };

  const addTriangle = () => {
    addWaveform('Math.abs(((2*f*t)%2-1))*2-1');
  };

  const addSquare = () => {
    addWaveform('(f*t)%2 >1?1:-1');
  };

  const addWaveform = (waveform: string) => {
    const current_waveform = getWaveform();

    songState.editWaveform(
      editorState.track,
      current_waveform + (current_waveform ? '+' : '') + waveform,
    );
  };

  const renderSlider = (
    key: 'volume' | 'attack' | 'sustain' | 'decay' | 'release',
    description = '',
  ) => {
    const instrument = songState.loaded[editorState.track];
    const val = instrument ? instrument[key] : 0;

    return (
      <div>
        <span style={{ marginRight: '10px' }}>{description}</span>
        <Slider
          type="range"
          min="0"
          max="1"
          step=".01"
          value={val}
          onChange={e => handleInstrumentPropertyChange(key, e)}
        />
        <SlideNumInput id={'slider' + key} value={val.toFixed(2)} />
      </div>
    );
  };

  return (
    <SoundFactoryContainer>
      <Input
        type="text"
        value={getWaveform()}
        onChange={handleInstrumentWaveformChange}
      />
      <AddWaveButton type="button" value="Add sinusoid" onClick={addSinusoid} />
      <AddWaveButton type="button" value="Add sawtooth" onClick={addSawTooth} />
      <AddWaveButton type="button" value="Add triangle" onClick={addTriangle} />
      <AddWaveButton type="button" value="Add square" onClick={addSquare} />
      <InstrumentPropertyContainer>
        {renderSlider('volume', 'Vol')}
        {renderSlider('attack', 'Atk')}
        {renderSlider('sustain', 'Sus')}
        {renderSlider('decay', 'Dec')}
        {renderSlider('release', 'Rel')}
      </InstrumentPropertyContainer>
    </SoundFactoryContainer>
  );
});

export default SoundFactory;
