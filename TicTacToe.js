import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameStats from './GameStats';
import './TicTacToe.css';

// Move winningLines outside the component
const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Move getBestMove outside the component
function getBestMove(board, player, depth = 4) {
  // Immediate win
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinnerStatic(testBoard).winner === player) {
        return i;
      }
    }
  }
  // Immediate block
  const opponent = player === 'O' ? 'X' : 'O';
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = opponent;
      if (checkWinnerStatic(testBoard).winner === opponent) {
        return i;
      }
    }
  }
  // Center, corners, edges
  const center = 4;
  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];
  if (board[center] === null) return center;
  for (let corner of corners) if (board[corner] === null) return corner;
  for (let edge of edges) if (board[edge] === null) return edge;
  // Any available
  const emptyCells = board.map((cell, idx) => cell === null ? idx : null).filter(v => v !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Static winner check for getBestMove
function checkWinnerStatic(currentBoard) {
  for (let line of winningLines) {
    const [a, b, c] = line;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return { winner: currentBoard[a], line };
    }
  }
  if (currentBoard.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  return { winner: null, line: null };
}

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvc'
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
    gamesPlayed: 0
  });
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'

  // UseCallback for checkWinner
  const checkWinner = useCallback((currentBoard) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw', line: null };
    }
    return { winner: null, line: null };
  }, []);

  // UseCallback for makeComputerMove
  const makeComputerMove = useCallback((currentBoard) => {
    const emptyCells = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null);

    if (emptyCells.length === 0) return;

    let moveIndex;
    if (difficulty === 'easy') {
      moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'medium') {
      if (Math.random() < 0.7) {
        moveIndex = getBestMove(currentBoard, 'O', 2);
      } else {
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    } else {
      moveIndex = getBestMove(currentBoard, 'O', 4);
    }
    return moveIndex;
  }, [difficulty]);

  const handleCellClick = (index) => {
    if (board[index] || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setGameStatus(result.winner === 'draw' ? 'draw' : 'won');
      updateStats(result.winner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  useEffect(() => {
    if (gameMode === 'pvc' && !isXNext && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const computerMove = makeComputerMove(board);
        if (computerMove !== undefined) {
          const newBoard = [...board];
          newBoard[computerMove] = 'O';
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result.winner) {
            setWinner(result.winner);
            setGameStatus(result.winner === 'draw' ? 'draw' : 'won');
            updateStats(result.winner);
          } else {
            setIsXNext(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode, gameStatus, makeComputerMove, checkWinner]);

  const updateStats = (gameWinner) => {
    setStats(prev => ({
      ...prev,
      xWins: gameWinner === 'X' ? prev.xWins + 1 : prev.xWins,
      oWins: gameWinner === 'O' ? prev.oWins + 1 : prev.oWins,
      draws: gameWinner === 'draw' ? prev.draws + 1 : prev.draws,
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
    setWinner(null);
  };

  const resetStats = () => {
    setStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      gamesPlayed: 0
    });
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `🎉 ${winner} Wins!`;
    } else if (gameStatus === 'draw') {
      return "🤝 It's a Draw!";
    } else {
      const currentPlayer = isXNext ? 'X' : 'O';
      const playerType = gameMode === 'pvc' && !isXNext ? 'Computer' : `Player ${currentPlayer}`;
      return `${playerType}'s Turn`;
    }
  };

  return (
    <div className="tic-tac-toe-container">
      <div className="game-header">
        <h1>🎮 Ultimate Tic-Tac-Toe</h1>
        <div className="status-message">{getStatusMessage()}</div>
      </div>

      <GameControls
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
        resetStats={resetStats}
      />

      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        gameStatus={gameStatus}
      />

      <GameStats stats={stats} />
    </div>
  );
};

export default TicTacToe;
