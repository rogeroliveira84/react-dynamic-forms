import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DynamicField extends Component {

  onChange = event => {
    const target = event.target;
    const name = target.name;

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

  fieldSelector = (props) => {
    switch (props.type) {
      case 'text':
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'number':
      default:
        return (
          <label htmlFor={props.id}>{props.label}
            <input
              name={props.id}
              type={props.type}
              onChange={(e) => this.onChange(e)}
              className="form-control"
              aria-describedby={props.id}
              placeholder={props.placeholder} 
              required={props.required === "true"} />
            <small id={props.id} className="form-text text-muted">{props.description}</small>
          </label>
        )

      case 'checkbox': return (
        <div className="form-check">
          <input type="checkbox" className="form-check-input" name={props.id} required={props.required === "true"} onChange={(e) => this.onChange(e)} />
          <label className="form-check-label" htmlFor={props.id}>{props.label}</label>
        </div>
      )

      case 'array': return (
        <label>
          {props.label}
          <select className="form-control" name={props.id} required={props.required === "true"} onChange={(e) => this.onChange(e)}>
            <option value="0"></option>
            {props.definition.options.map((option, i) => {
              return <option key={i} value={option.id}>{option.display}</option>
            })}
          </select>
          <small id={props.id} className="form-text text-muted">{props.description}</small>
        </label>
      )

      case 'multi-array': return (
        <label>
          {props.label}
          <select multiple={true} className="form-control" required={props.required === "true"} name={props.id} onChange={(e) => this.onChange(e)}>
            {props.definition.options.map((option, i) => {
              return <option key={i} value={option.id}>{option.display}</option>
            })}
          </select>
          <small id={props.id} className="form-text text-muted">{props.description}</small>
        </label>
      )
    }
  }

  render() {
    return (
      <div className="form-group">
        {this.fieldSelector(this.props)}
      </div>
    )
  }
}

DynamicField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  definition: PropTypes.object,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  placeHolder: PropTypes.string
};

export default DynamicField;
