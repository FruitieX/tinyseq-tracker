import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { playerState } from '../state/player';
import { editorState } from '../state/editor';
import { songState } from '../state/song';

import song from '../../song.json';
import { parseSong, TSSong } from '../types/instrument';
import SoundFactory from './SoundFactory';
import PlaybackHandler from './PlaybackToolbar';

import PatternWrapper from './PatternWrapper';
import { playNote } from '../utils/playNote';
import { keyboard2noteMapping } from '../utils/constants';
import NoteEditor from './NoteEditor';
import { Preview } from './Preview';

import { range } from 'fp-ts/es6/Array';
import FileManager from './FileManager';
import { noteCharToSound } from './Track';
import { instrumentsState } from '../state/instruments';

const NoteToolbar = styled.div`
  grid-area: note-toolbar;
  border: solid 1px #fff;
`;

const TrackerWrapper = styled.div`
  display: grid;

  padding: 1rem;
  gap: 1rem;

  grid-template-rows: auto 1fr 3fr auto;
  grid-template-columns: auto auto auto;

  grid-template-areas:
    'playback-toolbar   instruments   file-manager'
    'patterns           preview       preview'
    'main-editor        preview       preview'
    'note-toolbar       preview       preview';

  overflow: hidden;
`;

const GraphWrapper = styled.div`
  grid-area: header;
`;

export const Editor: React.FunctionComponent = observer(() => {
  React.useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      switch (ev.code) {
        case 'Space': // Spacebar
          playerState.togglePlayback();
          break;

        // keyboard piano
        default:
          const note = keyboard2noteMapping[ev.code];

          if (note !== undefined) {
            const notes = range(0, songState.loaded.length - 1).map(
              (_, index) => {
                if (index === editorState.track) {
                  return String.fromCharCode(
                    35 + note + 12 * editorState.octave,
                  );
                }

                return ' ';
              },
            );

            // Play notes instantly
            console.log('playing notes ', ...notes);

            notes.forEach((n, i) =>
              playNote(instrumentsState.instances[i], noteCharToSound(n) - 33),
            );
          }
          break;
      }
    };

    songState.setSong(parseSong(song as TSSong));
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOctaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editorState.setOctave(Number(e.target.value));
  };

  const handleNoteSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editorState.setNoteSkip(Number(e.target.value));
  };

  const renderToolbar = () => {
    return (
      <div>
        <span>Oct</span>
        <input
          id="octave"
          type="number"
          value={editorState.octave}
          onChange={handleOctaveChange}
          min="0"
          max="9"
        />
        <span>Skip</span>
        <input
          id="noteSkip"
          type="number"
          value={editorState.noteSkip}
          onChange={handleNoteSkipChange}
          min="1"
          max="32"
        />
      </div>
    );
  };

  return (
    <TrackerWrapper>
      <PatternWrapper />
      <GraphWrapper />
      <NoteEditor />
      <NoteToolbar>{renderToolbar()}</NoteToolbar>
      <PlaybackHandler />
      <SoundFactory />
      <Preview />
    </TrackerWrapper>
  );
});

export default Editor;
