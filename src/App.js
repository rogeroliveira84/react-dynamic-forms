import React, { Component } from 'react';
import DynamicForm from './components/dynamicForm/dynamicForm';
import configData from './config/form1.json';

class App extends Component {
  submitHandler = (event) => {
    let json = JSON.stringify(event, null, 4);
    console.log(json);
    document.getElementById('result').innerText = json;
  }
  render() {
    return (
      <div className="container">

        <DynamicForm config={configData} onSubmit={(event) => this.submitHandler(event)} />

        <div className="card mx-auto mt-5">
          <div className="card-header">Output</div>
          <div className="card-body">
            <pre id="result">Press Submit to see the output...</pre>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
