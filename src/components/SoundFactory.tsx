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
// style={{width: "40px", padding: "0", paddingLeft: "5px", border: "none", height: "initial"}}
const AddWaveButton = styled.input`
  ${baseButton};
  text-align: center;
  width: 120px;
`;

const InstrumentPropertyContainer = styled.div``;

const Slider = styled.input`
  &::-webkit-slider-thumb {
    background-color: #f00 !important;
    background: #f00 !important;
    color: #f00 !important;
  }
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

  addTriangle = () => {
    this.addWaveform('Math.abs(((2*f*t)%2-1))*2-1');
  };

  addSquare = () => {
    this.addWaveform('(f*t)%2 >1?1:-1');
  };

  addWaveform = (waveform: string) => {
    const current_waveform = this.getWaveform();

    this.props.editSong({
      waveform: current_waveform + (current_waveform ? '+' : '') + waveform,
      trackIndex: this.props.selectedTrack,
    });
  };

  renderSlider(id: string, description = '') {
    const instrument = this.props.loadedSong[this.props.selectedTrack];
    // @ts-ignore: this is fine
    const val = parseFloat(instrument[id]);
    return (
      <div>
        <span style={{ marginRight: '10px' }}>{description}</span>
        <Slider
          type="range"
          min="0"
          max="1"
          value={val}
          style={{ width: '50px' }}
        />
        <SlideNumInput id={'slider' + id} value={val} />
      </div>
    );
  }

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
        <AddWaveButton
          type="button"
          value="Add triangle"
          onClick={this.addTriangle}
        />
        <AddWaveButton
          type="button"
          value="Add square"
          onClick={this.addSquare}
        />
        <InstrumentPropertyContainer>
          {this.renderSlider('volume', 'Vol')}
          {this.renderSlider('attack', 'Atk')}
          {this.renderSlider('sustain', 'Sus')}
          {this.renderSlider('decay', 'Dec')}
          {this.renderSlider('release', 'Rel')}
        </InstrumentPropertyContainer>
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
