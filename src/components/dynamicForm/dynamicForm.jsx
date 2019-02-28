import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from './serializeHelper';
import DynamicField from '../dynamicField/dynamicField';
import '../../config/style.css';

class DynamicForm extends Component {
  state = { config: this.props.config };

  handleChange = (event) => {
    console.log(`handleChange: ${event.target.value}`)
  }

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

        {this.state.config.fields.map((field, i) => {
            return <DynamicField key={i} {...field} onChange={(e) => this.handleChange(e)} />
        })}

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
