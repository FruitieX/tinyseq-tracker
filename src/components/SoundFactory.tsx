import React from 'react';
import styled from 'styled-components';

const SoundFactoryContainer = styled.div`
  grid-area: right-top;
`;

export default class SoundFactory extends React.Component {
  state = {value: ""};

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({value: event.target.value});
  }
  addSine = () => {
    this.setState({value: this.state.value + "+Math.sin(2*2)"});
  }
  render() {
    return (
      <div>
        <button onClick={this.addSine}>sin(ft)</button>
        <input type="text" value={this.state.value} onChange={this.handleChange}></input>
      </div>
    );
  }
}

