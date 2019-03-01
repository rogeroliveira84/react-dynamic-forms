import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from './serializeHelper';
import DynamicField from '../dynamicField/dynamicField';
import '../../config/style.css';

class DynamicForm extends Component {
  state = { config: this.props.config };

  handleChange = (value) => {
    console.log(`handleChange: ${value}`)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let data = {
      timeStamp: Date.now(),
      data: JSON.parse(serialize(event.target))
    }
    this.props.onSubmit(data);
  }

  render() {
    return (
      <div className="card mx-auto mt-5">
        <div className="card-header">{this.state.config.name}</div>
        <div className="card-body">
          <form onSubmit={(event) => this.handleSubmit(event)} name={this.state.config.name}>

            {this.state.config.fields.map((field, i) => {
              return <DynamicField key={i} {...field} onChange={(e) => this.handleChange(e)} />
            })}

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

DynamicForm.propTypes = {
  config: PropTypes.any.isRequired,
  onSubmit: PropTypes.func
};

export default DynamicForm;
