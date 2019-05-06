import React from 'react';

// @ts-ignore
import initDemo from '../demo.js.txt';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: preview;
  display: flex;
`;

export const Preview: React.FunctionComponent = () => {
  React.useEffect(() => {
    const fragmentShader = require('../fragment.glsl');
    const vertexShader = require('../vertex.glsl');

    const src = initDemo
      .replace("require('./fragment.glsl')", `\`${fragmentShader}\``)
      .replace("require('./vertex.glsl')", `\`${vertexShader}\``);

    console.log('running initDemo');

    // work around strict mode ;)
    Function(src)();

    // Cleanup
    return () => {
      // @ts-ignore: Z is set by the demo
      cancelAnimationFrame(Z);
    };
  });

  return (
    <Wrapper>
      <canvas id="W" />
    </Wrapper>
  );
};
