import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { SongState, editSong } from '../state/song';
import { baseInput, baseButton } from '../utils/styles';
import { InstrumentManager } from './Instrument';

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

interface SoundFactoryProps {
  selectedTrack: number;
  loadedSong: SongState['loaded'];
  editSong: typeof editSong;
  instrumentRef: React.RefObject<InstrumentManager>;
}

export class SoundFactory extends React.Component<SoundFactoryProps> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.editSong({
      waveform: event.target.value,
      trackIndex: this.props.selectedTrack,
    });
  };

  componentDidUpdate(prevProps: any) {
    if (
      this.props.loadedSong[this.props.selectedTrack].waveform !==
      prevProps.loadedSong[prevProps.selectedTrack].waveform
    ) {
      try {
        new Function(this.props.loadedSong[this.props.selectedTrack].waveform);
        if (this.props.loadedSong[this.props.selectedTrack].waveform) {
          if (this.props.instrumentRef.current) {
            this.props.instrumentRef.current
              // @ts-ignore: this is fine
              .getWrappedInstance()
              .refreshInstruments();
          }
        }
      } catch (e) {
        console.log('Invalid wave string.');
      }
    }
  }

  getWaveform = () => {
    const { loadedSong, selectedTrack } = this.props;

    const row = loadedSong[selectedTrack];
    return row ? row.waveform : '';
  };

  addSinusoid = () => {
    this.addWaveform('Math.sin(Math.PI*2*f*t)');
  };

  addSawTooth = () => {
    this.addWaveform('1-((f*t)%1)*2');
  };
  addWaveform = (waveform: string) => {
    const current_waveform = this.getWaveform();

    this.props.editSong({
      waveform: current_waveform + (current_waveform ? '+' : '') + waveform,
      trackIndex: this.props.selectedTrack,
    });
  };

  render() {
    return (
      <SoundFactoryContainer>
        <Input
          type="text"
          value={this.getWaveform()}
          onChange={this.handleChange}
        />
        <AddWaveButton
          type="button"
          value="Add sinusoid"
          onClick={this.addSinusoid}
        />
        <AddWaveButton
          type="button"
          value="Add sawtooth"
          onClick={this.addSawTooth}
        />
      </SoundFactoryContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
  selectedTrack: state.editor.track,
});

const mapDispatchToProps = {
  editSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundFactory);
