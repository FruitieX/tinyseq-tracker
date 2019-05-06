import React from 'react';
import styled from 'styled-components';
import { songState } from '../state/song';
import { baseInput, baseButton } from '../utils/styles';
import { editorState } from '../state/editor';
import { observer } from 'mobx-react-lite';
import { instrumentsState } from '../state/instruments';

const SoundFactoryContainer = styled.div`
  grid-area: instruments;
`;

const Input = styled.input`
  ${baseInput};
`;

const AddWaveButton = styled.input`
  ${baseButton};
  text-align: center;
  width: 120px;
`;

export const SoundFactory: React.FunctionComponent = observer(() => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    songState.editWaveform(editorState.track, event.target.value);
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

  return (
    <SoundFactoryContainer>
      <Input type="text" value={getWaveform()} onChange={handleChange} />
      <AddWaveButton type="button" value="Add sinusoid" onClick={addSinusoid} />
      <AddWaveButton type="button" value="Add sawtooth" onClick={addSawTooth} />
      <AddWaveButton type="button" value="Add triangle" onClick={addTriangle} />
      <AddWaveButton type="button" value="Add square" onClick={addSquare} />
    </SoundFactoryContainer>
  );
});

export default SoundFactory;
