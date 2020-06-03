import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
import { Server, ServerResponse } from 'http';

/**
 * State declaration for <App />
 */

/*
In this case, whenever a type of IState
is used our application know that it should always have data and showGraph as properties to be valid
*/
interface IState {
  data: ServerRespond[],

  /*
    Adding a boolean showGraph, switching between true & false if want to show or not 
  */
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */

  /*
    add a condition to only render the graph when the
    state’s `showGraph` property of the App’s state is `true`
  */

  /*
    we had to do this because renderGraph gets called in the render method of the App component
  */
  renderGraph() {
    if(this.state.showGraph)
    {
      return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ 
          data: serverResponds, 
          showGraph: true,
        });
      });
      x++;
      if(x > 1000)
      {
        clearInterval(interval);
      }
    }, 100);
    
  }

  // Attempt to make a function that stops the server & table but instead it still runs
  // stopDataFromServer() {
  //   DataStreamer.stopData((serverResponds: ServerRespond[]) => {
  //     this.setState({
  //       data: serverResponds,
  //       showGraph: false,
  //     });
  //   });
  // }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>

          {/* <button className="btn btn-danger"
          // Adding a stop button to streaming
          onClick={() => {this.stopDataFromServer()}}>
            Stop Streaming Data
          </button> */}
          
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
