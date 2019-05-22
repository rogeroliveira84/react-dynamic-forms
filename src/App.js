import React from 'react';
import DynamicForm from './components/dynamicForm/dynamicForm';
import configData from './config/complete.json';

const App = () => {

    const submitHandler = event => {
        let json = JSON.stringify(event, null, 4);
        console.log(json);
        document.getElementById('result').innerText = json;
    }

    return (
        <div className="container">

            <DynamicForm config={configData} onSubmit={submitHandler} />

            <div className="card mx-auto mt-5">
                <div className="card-header">Output</div>
                <div className="card-body">
                    <pre id="result">Press Submit to see the output...</pre>
                </div>
            </div>

        </div>
    );
}

export default App;
