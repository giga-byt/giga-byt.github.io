import React from 'react';
import { TerminalContextProvider } from 'react-terminal';
import './App.css';
import FullPage from './Home';

function App() {
  return (
    <TerminalContextProvider>
      <div className="App">
        <FullPage/>
      </div>
    </TerminalContextProvider>
  );
}

export default App;
