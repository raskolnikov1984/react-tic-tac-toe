import { useState } from 'react';
import './styles.css';


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <MainTittle />
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function MainTittle() {
  return (
    <h1>Tic-Tac-Toe</h1>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const nextSquares = squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return < DrawBoard status={status} squares={squares} onSquareClick={handleClick} />;
}

function DrawBoard({ status, squares, onSquareClick }) {
  return (
    <>
      <div className="status">{status}</div>
      {(() => {
        const rows = [];
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
          const squareComponents = [];
          for (let colIndex = 0; colIndex < 3; colIndex++) {
            const squareIndex = rowIndex * 3 + colIndex;
            squareComponents.push(
              <Square
                key={squareIndex}
                value={squares[squareIndex]} // Use the squares prop here
                onSquareClick={() => onSquareClick(squareIndex)}
              />
            );
          }
          rows.push(
            <div className="board-row" key={rowIndex}>
              {squareComponents}
            </div>
          );
        }
        return rows;
      })()}
    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
