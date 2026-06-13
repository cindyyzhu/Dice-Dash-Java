// The board is 5×5 = 25 squares numbered 1–25 in snake order.
// Row 0 (bottom visual row) = squares 1–5 left-to-right
// Row 1 = squares 6–10 right-to-left, etc.
// We render the grid top-to-bottom visually, so row 4 = squares 1-5.

const PLAYER_COLORS = ['#e74c3c', '#2980b9', '#27ae60', '#f39c12'];

function getSnakeSquare(row, col) {
  // visual row 0 = top = squares 21-25 or 25-21
  // visual row 4 = bottom = squares 1-5
  const boardRow = 4 - row; // 0=bottom..4=top
  if (boardRow % 2 === 0) {
    // left to right
    return boardRow * 5 + col + 1;
  } else {
    // right to left
    return boardRow * 5 + (4 - col) + 1;
  }
}

export default function Board({ playerPositions, playerNames }) {
  // Build a map: squareNum -> list of player indices
  const squarePlayers = {};
  playerPositions.forEach((pos, i) => {
    if (pos > 0) {
      if (!squarePlayers[pos]) squarePlayers[pos] = [];
      squarePlayers[pos].push(i);
    }
  });

  return (
    <div className="board-wrap">
      <div className="board-grid">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const num = getSnakeSquare(row, col);
            const playersHere = squarePlayers[num] || [];
            const isSpecial10 = num === 10;
            const isSpecial20 = num === 20;
            const isFinish = num === 25;

            return (
              <div
                key={num}
                className={`square ${isSpecial10 ? 'special-10' : ''} ${isSpecial20 ? 'special-20' : ''} ${isFinish ? 'finish' : ''}`}
              >
                <span className="square-num">{num}</span>
                {isSpecial10 && <span className="square-label">✏️ TicTacToe</span>}
                {isSpecial20 && <span className="square-label">🔢 Guessing</span>}
                {isFinish && <span className="square-label">🏁 FINISH</span>}
                {playersHere.length > 0 && (
                  <div className="players-on-square">
                    {playersHere.map(pi => (
                      <div
                        key={pi}
                        className="player-pawn"
                        style={{ background: PLAYER_COLORS[pi] }}
                        title={playerNames[pi]}
                      >
                        {playerNames[pi]?.[0]?.toUpperCase() || pi + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { PLAYER_COLORS };
