import React from 'react';
import Grid from './Grid.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <Grid nrows={10} ncols={10}/>
    </div>
  );
}

export default App;
