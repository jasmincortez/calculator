import { Component } from 'react';
import Calculator from './Calculator';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="app">
        <Calculator />
        <text className="signature">
          Designed and coded by:
          <br />
          Edward Simmons
        </text>
      </div>
    );
  }
}

export default App;
