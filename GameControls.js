import React from 'react';

const GameControls = ({ 
  gameMode, 
  setGameMode, 
  difficulty, 
  setDifficulty, 
  resetGame, 
  resetStats 
}) => {
  return (
    <div className="game-controls">
      <div className="control-group">
        <label>Game Mode:</label>
        <select 
          value={gameMode} 
          onChange={(e) => {
            setGameMode(e.target.value);
            resetGame();
          }}
        >
          <option value="pvp">Player vs Player</option>
          <option value="pvc">Player vs Computer</option>
        </select>
      </div>

      {gameMode === 'pvc' && (
        <div className="control-group">
          <label>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => {
              setDifficulty(e.target.value);
              resetGame();
            }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      <div className="button-group">
        <button className="btn-primary" onClick={resetGame}>
          🔄 New Game
        </button>
        <button className="btn-secondary" onClick={resetStats}>
          📊 Reset Stats
        </button>
      </div>
    </div>
  );
};

export default GameControls;
