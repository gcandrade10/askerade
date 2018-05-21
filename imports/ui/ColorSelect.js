import React from 'react';
import { SketchPicker } from 'react-color';

export default class ColorSelect extends React.Component {
  state = {
    background: this.props.color,
  };

  handleChangeComplete = (color) => {
    this.props.onChangeComplete(color);
    this.setState({ background: color.hex });
  };

  render() {
    return (
      <SketchPicker
        color={ this.state.background }
        onChangeComplete={ this.handleChangeComplete }
      />
    );
  }
}
