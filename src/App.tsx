import React from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from "./theme";

import Nav from "./components/Nav";

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <Nav />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
