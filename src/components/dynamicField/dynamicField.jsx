import React, {useReducer} from 'react';
import PropTypes from 'prop-types';

const DynamicField = props => {
    // eslint-disable-next-line
    const [InputValue, setInputValue] = useReducer((state, newState) => ({...state, ...newState}), {});

    const onChange = event => {
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
        
        setInputValue({[name]: value});
        props.onChange(value);
    }

    const fieldSelector = props => {
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
                            onChange={onChange}
                            className="form-control"
                            aria-describedby={props.id}
                            placeholder={props.placeholder}
                            required={props.required === "true"} />
                        <small id={props.id} className="form-text text-muted">{props.description}</small>
                    </label>
                )

            case 'checkbox': return (
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" name={props.id} required={props.required === "true"} onChange={onChange} />
                    <label className="form-check-label" htmlFor={props.id}>{props.label}</label>
                </div>
            )

            case 'array': return (
                <label>
                    {props.label}
                    <select className="form-control" name={props.id} required={props.required === "true"} onChange={onChange}>
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
                    <select multiple={true} className="form-control" required={props.required === "true"} name={props.id} onChange={onChange}>
                        {props.definition.options.map((option, i) => {
                            return <option key={i} value={option.id}>{option.display}</option>
                        })}
                    </select>
                    <small id={props.id} className="form-text text-muted">{props.description}</small>
                </label>
            )
        }
    }

    return (
        <div className="form-group">
            {fieldSelector(props)}
        </div>
    )
}

DynamicField.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.object,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    label: PropTypes.string.isRequired,
    placeHolder: PropTypes.string
};

export default DynamicField;
