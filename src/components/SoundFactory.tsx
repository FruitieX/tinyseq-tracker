import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { SongState, editSong } from '../state/song';
import { baseInput } from '../utils/styles';

const SoundFactoryContainer = styled.div`
  grid-area: instruments;
`;

const Input = styled.input`
  ${baseInput};
`;

interface SoundFactoryProps {
  selectedTrack: number;
  loadedSong: SongState['loaded'];
  editSong: typeof editSong;
}

export class SoundFactory extends React.Component<SoundFactoryProps> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.editSong({
      waveform: event.target.value,
      trackIndex: this.props.selectedTrack,
    });
  };

  getWaveform = () => {
    const { loadedSong, selectedTrack } = this.props;

    const row = loadedSong[selectedTrack];
    return row ? row.waveform : '';
  };

  render() {
    return (
      <SoundFactoryContainer>
        <Input
          type="text"
          value={this.getWaveform()}
          onChange={this.handleChange}
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
