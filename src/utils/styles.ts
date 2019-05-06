import { css } from 'styled-components';

export const colors = {
  active: {
    bg: '#f52',
    fg: '#000',
  },
  inactive: {
    bg: '#444',
    fg: '#fff',
  },
  hover: {
    bg: '#666',
    fg: '#fff',
  },
};

export const border = '1px solid gray';

export const borderStyle = css`
  border: ${border};
`;

export const baseButton = css`
  outline: none;

  line-height: 1;
  color: ${colors.inactive.fg};
  background: ${colors.inactive.bg};
  ${borderStyle};

  height: 32px;

  &:hover {
    cursor: pointer;
    color: ${colors.hover.fg};
    background: ${colors.hover.bg};
  }
  &:active {
    color: ${colors.active.fg};
    background: ${colors.active.bg};
  }
`;

export const baseSlider = css`
  -webkit-appearance: none;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #222;
    height: 8px;
    width: 8px;
    cursor: pointer;
    &: hover {
      background: #555;
    }
  }
  &::-webkit-slider-runnable-track {
    height: 8px;
    cursor: pointer;
    background: #aaa;
  }
`;

export interface BaseInputProps {
  active?: boolean;
}

export const baseInput = css<BaseInputProps>`
  ${borderStyle};
  outline: none;

  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 8px;

  background-color: ${props =>
    props.active ? colors.active.bg : colors.inactive.bg};
  color: ${props => (props.active ? colors.active.fg : colors.inactive.fg)};
`;

export interface GridCellProps {
  x: number;
  y: number;
}

export const gridCell = css<GridCellProps>`
  grid-column: ${props => props.x + 1} / span 1;
  grid-row: ${props => props.y + 1} / span 1;
`;
