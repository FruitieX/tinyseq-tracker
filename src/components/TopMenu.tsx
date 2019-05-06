import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { FileManager } from './FileManager';

const TopMenuContainer = styled.div`
  position: fixed;
  background: #444;
  top: 0;
  left: 0;

  user-select: none;
  -webkit-user-select: none;

  span,
  label,
  button {
    line-height: 1.6;
    border: none;
  }
  ul {
    padding: 2px 10px;
    border: 1px solid #aaa;
    &:hover {
      li,
      label,
      button {
        display: list-item;
      }
    }
  }
  li,
  label,
  button {
    cursor: pointer;
    display: none;
    padding: 2px 0;
    border-top: 1px solid #ccc;
    &:hover {
      background: #aaa;
    }
  }
`;

const TopMenu = () => (
  <TopMenuContainer>
    <ul>
      <span>File ▾</span>
      <FileManager />
    </ul>
  </TopMenuContainer>
);

export default TopMenu;
