import React from 'react';
import styled from 'styled-components';

import { songState } from '../state/song';
import { baseButton } from '../utils/styles';
import { observer } from 'mobx-react-lite';
import { parseSong } from '../types/instrument';

const Button = styled.button`
  ${baseButton};
  font-size: 16px;
  display: list-item;
`;

const UploadButton = styled.label`
  font-size: 16px;
`;

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

export const FileManager: React.FunctionComponent = observer(() => {
  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    var reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        songState.setSong(parseSong(JSON.parse(reader.result.toString())));
      }
    };

    if (e.target.files) {
      reader.readAsText(e.target.files[0]);
    }
  };

  const save = () =>
    download(
      JSON.stringify(songState.loaded, null, 2),
      'song.json',
      'application/json',
    );

  return (
    <React.Fragment>
      <UploadButton htmlFor="load">Load song</UploadButton>
      <input
        id="load"
        type="file"
        onChange={load}
        style={{ display: 'none' }}
      />
      <Button onClick={save}>Save song</Button>
    </React.Fragment>
  );
});

export default FileManager;
