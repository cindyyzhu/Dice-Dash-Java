import { useState, useRef } from 'react';
import Board, { PLAYER_COLORS } from './Board.jsx';
import TicTacToe from './TicTacToe.jsx';
import NumberGuessing from './NumberGuessing.jsx';
import './index.css';

// Screens: setup-players | setup-usernames | instructions | game | winner
// Minigame overlay: null | 'tictactoe' | 'numberguess'

export default function App() {
  const [screen, setScreen] = useState('setup-players');
  const [numPlayers, setNumPlayers] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [usernames, setUsernames] = useState(['', '', '', '']);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerPositions, setPlayerPositions] = useState([-1, -1, -1, -1]); // -1 = not yet on board
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);
  const [minigame, setMinigame] = useState(null); // null | 'tictactoe' | 'numberguess'
  const [winner, setWinner] = useState(null);
  const [rolling, setRolling] = useState(false);
  const rollAnim = useRef(null);

  // ── SETUP ──
  function handleNumPlayersNext() {
    const n = parseInt(numPlayers, 10);
    if (isNaN(n) || n < 2 || n > 4) {
      alert('Please enter a number between 2 and 4.');
      return;
    }
    setPlayerCount(n);
    setUsernames(['', '', '', '']);
    setScreen('setup-usernames');
  }

  function handleUsernamesNext() {
    const names = usernames.slice(0, playerCount).map((u, i) => u.trim() || `Player ${i + 1}`);
    setPlayerNames(names);
    setScreen('instructions');
  }

  function startGame(names) {
    const n = names.length;
    setPlayerPositions(Array(n).fill(-1));
    setCurrentPlayer(0);
    setLastRoll(null);
    setWinner(null);
    setMinigame(null);
    setScreen('game');
  }

  // ── DICE ──
  function rollDice() {
    if (rolling || minigame || winner) return;
    setRolling(true);

    let count = 0;
    rollAnim.current = setInterval(() => {
      setLastRoll(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 8) {
        clearInterval(rollAnim.current);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setLastRoll(finalRoll);
        setRolling(false);
        movePlayer(currentPlayer, finalRoll);
      }
    }, 80);
  }

  function movePlayer(pi, roll) {
    // Compute new position outside setState to avoid stale closures
    const cur = playerPositions[pi] < 1 ? 0 : playerPositions[pi];
    let newPos = Math.min(cur + roll, 25);

    const nextPositions = [...playerPositions];
    nextPositions[pi] = newPos;
    setPlayerPositions(nextPositions);

    if (newPos >= 25) {
      setWinner(playerNames[pi]);
      return;
    }

    // Trigger minigame if landing on special square — advance turn only after close
    if (newPos === 10) {
      setMinigame('tictactoe');
    } else if (newPos === 20) {
      setMinigame('numberguess');
    } else {
      // No minigame — advance turn immediately
      setCurrentPlayer((pi + 1) % playerNames.length);
    }
  }

  function handleMinigameClose() {
    // Capture currentPlayer before clearing minigame
    const next = (currentPlayer + 1) % playerNames.length;
    setMinigame(null);
    setCurrentPlayer(next);
  }

  function resetAll() {
    setScreen('setup-players');
    setNumPlayers('');
    setPlayerCount(2);
    setUsernames(['', '', '', '']);
    setPlayerNames([]);
    setPlayerPositions([-1, -1, -1, -1]);
    setCurrentPlayer(0);
    setLastRoll(null);
    setMinigame(null);
    setWinner(null);
    setRolling(false);
  }

  // ── RENDER ──

  if (screen === 'setup-players') return (
    <div className="setup-card">
      <div className="game-title">🎲 Dice Dash</div>
      <div className="game-subtitle">by Cindy &amp; Stella · June 2023</div>
      <div className="setup-heading">How many players?</div>
      <div className="input-row">
        <label>Players (2–4):</label>
        <input
          type="number" min={2} max={4}
          value={numPlayers}
          onChange={e => setNumPlayers(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNumPlayersNext()}
          autoFocus
        />
      </div>
      <button className="btn" onClick={handleNumPlayersNext}>Next →</button>
    </div>
  );

  if (screen === 'setup-usernames') return (
    <div className="setup-card">
      <div className="game-title">🎲 Dice Dash</div>
      <div className="setup-heading">Enter Usernames</div>
      <div className="username-fields">
        {Array.from({ length: playerCount }, (_, i) => (
          <div className="username-row" key={i}>
            <div className="player-dot" style={{ background: PLAYER_COLORS[i] }} />
            <label>Player {i + 1}:</label>
            <input
              type="text"
              value={usernames[i]}
              placeholder={`Player ${i + 1}`}
              onChange={e => {
                const u = [...usernames];
                u[i] = e.target.value;
                setUsernames(u);
              }}
              onKeyDown={e => e.key === 'Enter' && i === playerCount - 1 && handleUsernamesNext()}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setScreen('setup-players')}>← Back</button>
        <button className="btn" onClick={handleUsernamesNext}>Next →</button>
      </div>
    </div>
  );

  if (screen === 'instructions') return (
    <div className="setup-card">
      <div className="game-title">🎲 Dice Dash</div>
      <div className="setup-heading">How to Play</div>
      <ul className="instructions-list">
        <li>Each player rolls the dice and moves forward that many squares.</li>
        <li>The board has 25 squares — first to reach square 25 wins!</li>
        <li className="special">Land on square <strong>10</strong> → play Tic-Tac-Toe!</li>
        <li className="special">Land on square <strong>20</strong> → play Number Guessing!</li>
        <li>Players take turns in order. Good luck! 🍀</li>
      </ul>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setScreen('setup-usernames')}>← Back</button>
        <button className="btn" onClick={() => startGame(playerNames)}>Start Game! 🎲</button>
      </div>
    </div>
  );

  if (screen === 'game') return (
    <div className="game-screen">
      <Board
        playerPositions={playerPositions.slice(0, playerNames.length)}
        playerNames={playerNames}
      />

      <div className="sidebar">
        <div className="sidebar-title">🎲 Dice Dash</div>

        {playerNames.map((name, i) => (
          <div key={i} className={`player-card ${i === currentPlayer ? 'active' : ''}`}>
            <div className="player-card-header">
              <div className="player-dot" style={{ background: PLAYER_COLORS[i], width: 12, height: 12, borderRadius: '50%' }} />
              <span className="player-name">{name}</span>
            </div>
            <div className="player-pos">
              Square: {playerPositions[i] < 1 ? 'Start' : playerPositions[i]} / 25
            </div>
          </div>
        ))}

        <div className="current-turn">
          {rolling ? '🎲 Rolling…' : `${playerNames[currentPlayer]}'s turn`}
        </div>

        {lastRoll && (
          <div style={{ textAlign: 'center', fontSize: 28 }}>
            {'⚀⚁⚂⚃⚄⚅'[lastRoll - 1]} {lastRoll}
          </div>
        )}

        <button
          className="btn dice-btn"
          onClick={rollDice}
          disabled={rolling || !!minigame || !!winner}
        >
          {rolling ? '…' : '🎲 Roll Dice'}
        </button>

        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={resetAll}>
          🔄 New Game
        </button>
      </div>

      {/* Minigames */}
      {minigame === 'tictactoe' && <TicTacToe onClose={handleMinigameClose} />}
      {minigame === 'numberguess' && <NumberGuessing onClose={handleMinigameClose} />}

      {/* Winner modal */}
      {winner && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>🏆 We have a winner!</h2>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#7b2d00' }}>
              {winner} wins Dice Dash!
            </p>
            <p>Congratulations! 🎉</p>
            <div className="modal-btns" style={{ marginTop: 16 }}>
              <button className="btn" onClick={resetAll}>Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
