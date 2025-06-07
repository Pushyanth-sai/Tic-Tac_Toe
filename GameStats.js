import React from 'react';

const GameStats = ({ stats }) => {
  const winRate = stats.gamesPlayed > 0 
    ? ((stats.xWins / stats.gamesPlayed) * 100).toFixed(1)
    : 0;

  return (
    <div className="game-stats">
      <h3>📈 Game Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">X Wins</span>
          <span className="stat-value">{stats.xWins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">O Wins</span>
          <span className="stat-value">{stats.oWins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Draws</span>
          <span className="stat-value">{stats.draws}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Games</span>
          <span className="stat-value">{stats.gamesPlayed}</span>
        </div>
      </div>
      <div className="win-rate">
        Player X Win Rate: {winRate}%
      </div>
    </div>
  );
};

export default GameStats;
