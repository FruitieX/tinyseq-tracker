import React from 'react';
import styled from 'styled-components';

import { Song } from '../types/instrument';

import { connect } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { setSong } from '../state/song';
import { DeepReadonly } from 'utility-types';
import { baseButton } from '../utils/styles';

const Wrapper = styled.div`
  grid-area: file-manager;
  display: flex;
`;

const Button = styled.button`
  ${baseButton};
  font-size: 16px;
`;

const UploadButton = styled.label`
  ${baseButton};
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 8px;
  padding-right: 8px;
  margin-right: 16px;
`;

interface FileManagerProps {
  loadedSong: DeepReadonly<Song>;
  setSong: typeof setSong;
}

// Function to download data to a file
// https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(data: string, filename: string, type: string) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export class FileManager extends React.Component<FileManagerProps> {
  load = (e: React.ChangeEvent<HTMLInputElement>) => {
    var reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        this.props.setSong(JSON.parse(reader.result.toString()));
      }
    };

    if (e.target.files) {
      reader.readAsText(e.target.files[0]);
    }
  };

  save = () =>
    download(
      JSON.stringify(this.props.loadedSong, null, 2),
      'song.json',
      'application/json',
    );

  render() {
    return (
      <Wrapper>
        <UploadButton htmlFor="load">Load song</UploadButton>
        <input
          id="load"
          type="file"
          onChange={this.load}
          style={{ display: 'none' }}
        />
        <Button onClick={this.save}>Save song</Button>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadedSong: state.song.loaded,
});

const mapDispatchToProps = {
  setSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileManager);
