import React from 'react';
import serialize from './serializeHelper';
import DynamicField from '../dynamicField/dynamicField';
import '../../config/style.css';

const DynamicForm = props => {

    const { config } = props;

    const handleChange = value => {
        console.log(`handleChange: ${value}`)
    }

    const handleSubmit = event => {
        event.preventDefault();
        let data = {
            timeStamp: Date.now(),
            data: JSON.parse(serialize(event.target))
        }
        props.onSubmit(data);
    }

    return (
        <div className="card mx-auto mt-5">
            <div className="card-header">{config.name}</div>
            <div className="card-body">
                <form onSubmit={handleSubmit} name={config.name}>

                    {config.fields.map((field, i) => {
                        return <DynamicField key={i} {...field} onChange={handleChange} />
                    })}

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default DynamicForm;
