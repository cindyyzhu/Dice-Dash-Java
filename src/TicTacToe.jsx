import { useState, useCallback } from 'react';

function checkWin(board, mark) {
  const b = board;
  for (let r = 0; r < 3; r++) {
    if (b[r][0] === mark && b[r][1] === mark && b[r][2] === mark) return true;
  }
  for (let c = 0; c < 3; c++) {
    if (b[0][c] === mark && b[1][c] === mark && b[2][c] === mark) return true;
  }
  if (b[0][0] === mark && b[1][1] === mark && b[2][2] === mark) return true;
  if (b[0][2] === mark && b[1][1] === mark && b[2][0] === mark) return true;
  return false;
}

function emptyBoard() {
  return [['','',''],['','',''],['','','']];
}

function computerMove(board) {
  const empty = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[r][c] === '') empty.push([r, c]);
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map(row => [...row]);
  next[r][c] = 'O';
  return next;
}

export default function TicTacToe({ onClose }) {
  const [board, setBoard] = useState(emptyBoard());
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState(null); // null | 'win' | 'lose' | 'draw'
  const [moves, setMoves] = useState(0);

  const handleCell = useCallback((r, c) => {
    if (!isPlayerTurn || board[r][c] !== '' || result) return;

    // Player move
    const next = board.map(row => [...row]);
    next[r][c] = 'X';
    const m = moves + 1;

    if (checkWin(next, 'X')) {
      setBoard(next); setMoves(m); setResult('win'); return;
    }
    if (m === 9) {
      setBoard(next); setMoves(m); setResult('draw'); return;
    }

    // Computer move
    const after = computerMove(next);
    const m2 = m + 1;
    if (checkWin(after, 'O')) {
      setBoard(after); setMoves(m2); setResult('lose'); return;
    }
    if (m2 === 9) {
      setBoard(after); setMoves(m2); setResult('draw'); return;
    }

    setBoard(after);
    setMoves(m2);
  }, [board, isPlayerTurn, result, moves]);

  function reset() {
    setBoard(emptyBoard());
    setIsPlayerTurn(true);
    setResult(null);
    setMoves(0);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>⚡ Mini-Game: Tic-Tac-Toe</h2>
        <p>You are <strong style={{color:'#c0392b'}}>X</strong>. Beat the computer!</p>

        {result && (
          <p style={{
            fontSize: 20, fontWeight: 'bold', marginBottom: 8,
            color: result === 'win' ? '#228822' : result === 'lose' ? '#c0392b' : '#c8a400'
          }}>
            {result === 'win' ? '🎉 You win!' : result === 'lose' ? '💻 Computer wins!' : "🤝 It's a draw!"}
          </p>
        )}

        <div className="ttt-grid">
          {board.map((row, r) => row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`ttt-cell ${cell ? 'taken' : ''} ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''}`}
              onClick={() => handleCell(r, c)}
            >
              {cell}
            </div>
          )))}
        </div>

        <div className="modal-btns">
          {result ? (
            <>
              <button className="btn" onClick={reset}>Play Again</button>
              <button className="btn btn-secondary" onClick={onClose}>Back to Game</button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>Skip</button>
          )}
        </div>
      </div>
    </div>
  );
}
