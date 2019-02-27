import React, { Component } from 'react';
import DynamicForm from './components/dynamicForm';
import configData from './config/form1.json'; 

class App extends Component {
  submitHandler = (event) => {
    console.log(JSON.stringify(event))
  }
  render() {
    return (
      <DynamicForm config={configData} onSubmit={(event) => this.submitHandler(event)} />
    );
  }
}

export default App;
