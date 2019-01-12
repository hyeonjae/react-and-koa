import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  login = async () => {
    // alert('click');
    const res = await axios.get('/auth/google');
    console.log(res && res.data);
  }

  hello = async () => {
    // alert('click');
    const res = await axios.get('/api/hello');
    console.log(res && res.data);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a onClick={this.login}>login</a>
          <a onClick={this.hello}>hello</a>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
