import * as React from 'react';
import { Instrument, InstrumentInstance } from '../types/instrument';

import { noteCharToSound } from './Track';
import { songState } from '../state/song';
import { observer } from 'mobx-react-lite';
import { editorState } from '../state/editor';
import { playerState } from '../state/player';

// TODO: put these in config
const I_WAVEFORM = 0;
const I_TRANSPOSE = 1;
const I_NOTES = 2;
const I_SECONDS_PER_ROW = 3;
const I_VOLUME = 4;
const I_ATTACK = 5;
const I_DECAY = 6;
const I_SUSTAIN = 7;
const I_RELEASE = 8;
