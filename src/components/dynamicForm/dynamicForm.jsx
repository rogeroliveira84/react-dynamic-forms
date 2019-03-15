import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from './serializeHelper';
import DynamicField from '../dynamicField/dynamicField';
import '../../config/style.css';

class DynamicForm extends Component {
  
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
    const { config } = this.props;
    return (
      <div className="card mx-auto mt-5">
        <div className="card-header">{config.name}</div>
        <div className="card-body">
          <form onSubmit={(event) => this.handleSubmit(event)} name={config.name}>
            {config.fields.map((field, i) => {
              return <DynamicField key={field.id} {...field} onChange={(e) => this.handleChange(e)} />
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
