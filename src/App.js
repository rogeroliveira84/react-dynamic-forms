import React, { Component } from 'react';
import DynamicForm from './components/dynamicForm';
import configData from './config/form1.json'; 

class App extends Component {

  render() {
    return (
      <DynamicForm config={configData} />
    );
  }
}

export default App;
