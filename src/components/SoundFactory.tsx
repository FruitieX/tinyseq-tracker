import React from 'react';
import styled from 'styled-components';
import { RootState } from '../state/rootReducer';
import { connect } from 'react-redux';
import { SongState, EditSong, editSong } from '../state/song';
import { Dispatch } from 'redux';

const SoundFactoryContainer = styled.div`
  grid-area: right-top;
`;

interface SoundFactoryProps {
  selectedTrack: number;
  loadedSong: SongState['loaded'];
  editSong: (editSongParams: EditSong) => void;
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

  addSine = () => {
    this.setState({ value: this.getWaveform() + '+Math.sin(2*2)' });
  };

  render() {
    return (
      <SoundFactoryContainer>
        <button onClick={this.addSine}>sin(ft)</button>
        <input
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  editSong: (editSongParams: EditSong) => dispatch(editSong(editSongParams)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundFactory);
