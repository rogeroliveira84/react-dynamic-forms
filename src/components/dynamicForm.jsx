import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DynamicForm extends Component {
  constructor(props) {
    super(props);
    this.state = { config: this.props.config };
  }

  render() {
    return (
      <form name={this.state.config.name}>
      </form>
    );
  }
}

DynamicForm.propTypes = {
  config: PropTypes.any.isRequired
};

export default DynamicForm;
