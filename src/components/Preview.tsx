import React from 'react';

// @ts-ignore
import initDemo from '../demo.js.txt';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: preview;
  display: flex;
`;

export class Preview extends React.PureComponent {
  componentDidMount() {
    const fragmentShader = require('../fragment.glsl');
    const vertexShader = require('../vertex.glsl');

    const src = initDemo
      .replace("require('./fragment.glsl')", `\`${fragmentShader}\``)
      .replace("require('./vertex.glsl')", `\`${vertexShader}\``);

    console.log('running initDemo');

    // work around strict mode ;)
    Function(src)();
  }

  componentWillUnmount() {
    // @ts-ignore: Z is set by the demo
    cancelAnimationFrame(Z);
  }

  render() {
    return (
      <Wrapper>
        <canvas id="W" />
      </Wrapper>
    );
  }
}
