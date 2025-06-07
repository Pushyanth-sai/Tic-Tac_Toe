import React from 'react';

const GameBoard = ({ board, onCellClick, gameStatus }) => {
  return (
    <div className="game-board">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`cell ${cell ? 'filled' : ''} ${gameStatus !== 'playing' ? 'disabled' : ''}`}
          onClick={() => onCellClick(index)}
          disabled={gameStatus !== 'playing'}
        >
          <span className={`symbol ${cell ? cell.toLowerCase() : ''}`}>
            {cell}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
