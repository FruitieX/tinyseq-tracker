import React from 'react';
import styled from 'styled-components';
import {
  Instrument,
  defaultInstrument,
  timeFromBeginning,
} from '../types/instrument';
import Track from './Track';
import { keyboard2noteMapping } from '../utils/constants';
import { colors, baseButton } from '../utils/styles';
import { observer } from 'mobx-react-lite';
import { songState } from '../state/song';
import { editorState } from '../state/editor';
import { playerState } from '../state/player';

const Wrapper = styled.div`
  grid-area: main-editor;
  display: flex;
  flex-direction: row;
  user-select: none;
  border: solid 1px #fff;
  overflow: auto;
  .track-name {
    text-align: center;
    margin-bottom: 10px;
  }

  &:focus {
    border: solid 1px ${colors.active.bg};
    outline: none;
  }
`;

const AddInstrumentButton = styled.button`
  ${baseButton};
`;

const NoteEditor: React.FunctionComponent = observer(() => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (ev: KeyboardEvent) => {
    const activeTrack = songState.loaded[editorState.track];
    const activeTrackNotes =
      activeTrack &&
      activeTrack.notes[activeTrack.patterns[editorState.pattern] - 1];

    const numRows = activeTrackNotes ? activeTrackNotes.length : 1;

    const numTracks = songState.loaded.length;

    const patternNotes = songState.loaded.map(
      t => t.notes[t.patterns[editorState.pattern] - 1],
    );

    switch (ev.code) {
      case 'ArrowDown':
        ev.stopPropagation();
        editorState.changeRow({ offset: 1, numRows });
        return;

      case 'ArrowUp':
        ev.stopPropagation();
        editorState.changeRow({ offset: -1, numRows });
        return;

      case 'ArrowLeft':
        ev.stopPropagation();
        return editorState.changeTrack({
          offset: -1,
          numTracks: numTracks,
          song: patternNotes,
        });

      case 'ArrowRight':
        ev.stopPropagation();
        return editorState.changeTrack({
          offset: 1,
          numTracks: numTracks,
          song: patternNotes,
        });

      case 'Backspace':
        ev.stopPropagation();

        songState.editNote(
          editorState.track,
          editorState.row,
          songState.loaded[editorState.track].patterns[editorState.pattern] - 1,
          '!',
        );

        return editorState.changeRow({ offset: editorState.noteSkip, numRows });

      case 'Delete':
        ev.stopPropagation();

        songState.editNote(
          editorState.track,
          editorState.row,
          songState.loaded[editorState.track].patterns[editorState.pattern] - 1,
          ' ',
        );

        return editorState.changeRow({ offset: editorState.noteSkip, numRows });

      // edit notes
      default:
        const note = keyboard2noteMapping[ev.code];

        if (note !== undefined) {
          ev.stopPropagation();

          songState.editNote(
            editorState.track,
            editorState.row,
            songState.loaded[editorState.track].patterns[editorState.pattern] -
              1,
            String.fromCharCode(35 + note + 12 * editorState.octave),
          );

          return editorState.changeRow({
            offset: editorState.noteSkip,
            numRows,
          });
        }
    }
  };

  const handleAddInstrumentClick = () => {
    // create new instrument from the default instrument settings
    // TODO: fix the creating of an instrument in a better way
    // var i = <Instrument>{defaultInstrument};
    // make the first note string as long as the the note string of the first instrument
    //  i.notes[0] = Array(this.props.loadedSong[0].notes[0].length + 1).join(" ");
    // and send it off to the addInstrument function
    songState.addInstrument(defaultInstrument);
  };

  const handleNoteClick = (trackIndex: number, rowIndex: number) => {
    editorState.changeTrack({ value: trackIndex });
    editorState.changeRow({ value: rowIndex });
  };

  const renderTrack = (instrument: Instrument, index: number) => {
    return (
      <Track
        key={index}
        index={index}
        instrument={instrument}
        currentPattern={editorState.pattern}
        selected={editorState.track === index}
        onClickNote={handleNoteClick}
        selectedRow={editorState.row}
      />
    );
  };

  React.useEffect(() => {
    const ref = editorRef.current;
    if (!ref) return;

    ref.addEventListener('keydown', handleKeyDown);

    return () => ref.removeEventListener('keydown', handleKeyDown);
  }, [editorRef, handleKeyDown]);

  React.useEffect(() => {
    if (playerState.playback === 'paused') {
      playerState.setTime(
        timeFromBeginning(
          songState.loaded,
          editorState.track,
          editorState.pattern,
          editorState.row,
        ),
      );
    }
  }, [editorState.row, editorState.pattern, playerState.playback]);

  return (
    <Wrapper innerRef={editorRef} tabIndex={0}>
      {songState.loaded.map(renderTrack)}

      <AddInstrumentButton type="button" onClick={handleAddInstrumentClick}>
        {`+`}
      </AddInstrumentButton>
    </Wrapper>
  );
});

export default NoteEditor;
