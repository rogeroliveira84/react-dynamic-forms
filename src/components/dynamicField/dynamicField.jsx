import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DynamicField extends Component {
  onChange = event => {
    const { target, name } = event;

    let value = undefined; 
    switch (target.type) {
      case 'checkbox':
        value = target.checked
        break;
      case 'select-multiple':
        value = [...target.selectedOptions].map(x => x.value)
      break;
      default:
        value = target.value;
        break;
    }

    this.setState({ [name]: value });
    this.props.onChange(value);
  }
  render() {
    return (
      <div className="field">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input 
          id={this.props.id} 
          type={this.props.type}
          onChange={(e) => this.onChange(e.target.value)} />
      </div>
    )
  }
}

DynamicField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  definition: PropTypes.object,
  required: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  label: PropTypes.string.isRequired,
  placeHolder: PropTypes.string
};

export default DynamicField;
