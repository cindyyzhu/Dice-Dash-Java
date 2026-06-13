import { useState, useRef } from 'react';

const MAX_ATTEMPTS = 4;

export default function NumberGuessing({ onClose }) {
  const [target] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const inputRef = useRef(null);

  function handleSubmit() {
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 10) {
      setFeedback('Please enter a number between 1 and 10.');
      setGuess('');
      return;
    }

    const next = attempts + 1;
    setAttempts(next);

    if (n === target) {
      setFeedback('');
      setWon(true);
      setDone(true);
    } else if (next >= MAX_ATTEMPTS) {
      setFeedback(`Out of attempts! The number was ${target}.`);
      setDone(true);
    } else {
      setFeedback(`Wrong guess. Try again! (${MAX_ATTEMPTS - next} left)`);
      setGuess('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>⚡ Mini-Game: Number Guessing</h2>
        <p>
          I'm thinking of a number from <strong>1–10</strong>.<br />
          Guess it in less than <strong>{MAX_ATTEMPTS} tries</strong> to win!
        </p>

        {done ? (
          <>
            <p style={{
              fontSize: 20, fontWeight: 'bold',
              color: won ? '#228822' : '#c0392b'
            }}>
              {won ? `🎉 Correct! It was ${target}!` : `😞 ${feedback}`}
            </p>
            <div className="modal-btns" style={{marginTop: 16}}>
              <button className="btn" onClick={onClose}>Back to Game</button>
            </div>
          </>
        ) : (
          <>
            <div className="guess-feedback">{feedback}</div>
            <div className="attempts-left">
              Attempts used: {attempts} / {MAX_ATTEMPTS}
            </div>
            <div className="guess-form">
              <input
                ref={inputRef}
                type="number"
                min={1} max={10}
                value={guess}
                onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
                placeholder="1–10"
              />
              <button className="btn" onClick={handleSubmit}>Guess!</button>
            </div>
            <div className="modal-btns">
              <button className="btn btn-secondary" onClick={onClose}>Skip</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
