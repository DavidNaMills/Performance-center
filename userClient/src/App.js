import React, { Component } from 'react';
import './App.css';
import socket from './utilities/socketConnection';

import Widget from './Components/Widget';


class App extends Component {
  constructor(){
    super();
    this.state={
      performanceData: {}
    }
  };

  componentDidMount(){
    socket.on('data', (data)=>{
      let currentState = ({...this.state.performanceData});
      currentState[data.macA]=data;
      this.setState({performanceData:currentState})
    })
  }
  render() {
    let widgets=[];
    const data = this.state.performanceData;
    Object.entries(data).forEach(([key, value])=>{
      widgets.push(<Widget key={key} data={value}/>)
    })
    return (
      <div className="App">

        {widgets}
      </div>
    );
  }
}

export default App;
