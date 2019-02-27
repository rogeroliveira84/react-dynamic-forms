import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from './serializeHelper';

class DynamicForm extends Component {
  state = { config: this.props.config };

  handleSubmit = (event) => {
    event.preventDefault();
    let data = {
      timeStamp: Date.now(),
      data: serialize(event.target)
    }
    this.props.onSubmit(data);
  }
  render() {
    return (
      <form onSubmit={(event) => this.handleSubmit(event)} name={this.state.config.name}>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

DynamicForm.propTypes = {
  config: PropTypes.any.isRequired,
  onSubmit: PropTypes.func
};

export default DynamicForm;
