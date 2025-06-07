import React from 'react';
import TicTacToe from './components/TicTacToe';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Decorative circle in the top right */}
      <div className="circle-decor"></div>
      {/* Dotted pattern in the bottom right */}
      <div className="dots">
        {Array.from({ length: 15 }).map((_, i) => <span key={i}></span>)}
      </div>
      {/* Main TicTacToe game */}
      <TicTacToe />
    </div>
  );
}

export default App;
