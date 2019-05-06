import React from 'react';

// @ts-ignore
import initDemo from '../demo.js.txt';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: preview;
  display: flex;
  position: relative;
`;

const Error = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  color: black;
  opacity: 0.75;
  overflow: auto;
`;

const ErrorText = styled.pre`
  padding: 32px;
`;

// Set by demo to return value of requestAnimationFrame
let Z: number = -1;

export const Preview: React.FunctionComponent = () => {
  const [compileError, setError] = React.useState<string>();

  React.useEffect(() => {
    const fragmentShader = require('../fragment.glsl');
    const vertexShader = require('../vertex.glsl');

    const src = initDemo
      .replace("require('./fragment.glsl')", `\`${fragmentShader}\``)
      .replace("require('./vertex.glsl')", `\`${vertexShader}\``);

    console.log('running initDemo');

    try {
      // work around strict mode ;)
      Function(src)();

      setError(undefined);
    } catch (e) {
      console.error(e);
      setError(e);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(Z);
    };
  });

  return (
    <Wrapper>
      <canvas id="W" />
      {compileError && (
        <Error>
          <ErrorText>{compileError}</ErrorText>
        </Error>
      )}
    </Wrapper>
  );
};
