import React from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { resetGame } from '../state/gameSlice';
import { resetResources } from '../redux/resourcesSlice';
import './EndGameModal.css';

/**
 * Modal that appears when the game ends (win or lose)
 * Displays the game outcome and allows restarting
 */
const EndGameModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gameEnded, gameWon, endReason } = useAppSelector(state => state.game);
  
  const handleRestart = () => {
    dispatch(resetGame());
    dispatch(resetResources());
    window.location.reload(); // Ensure a clean restart
  };
  
  if (!gameEnded) return null;
  
  return (
    <div className="end-game-modal-overlay">
      <div className="end-game-modal">
        <div className={`end-game-header ${gameWon ? 'win' : 'lose'}`}>
          <h2>{gameWon ? "Victory!" : "Game Over"}</h2>
        </div>
        
        <div className="end-game-content">
          <div className="end-game-icon">
            {gameWon ? '🌟' : '💔'}
          </div>
          
          <p className="end-game-reason">{endReason}</p>
          
          {gameWon ? (
            <p className="end-game-description">
              Your movement has successfully achieved its goals and established
              a new, more equitable system! The powers of corporate oppression have been
              overcome through solidarity and collective action.
            </p>
          ) : (
            <p className="end-game-description">
              Your movement was overwhelmed by corporate opposition.
              The struggle continues, even when it faces setbacks.
              Remember the lessons learned and try a different strategy.
            </p>
          )}
          
          <button 
            className={`end-game-button ${gameWon ? 'win-button' : 'lose-button'}`}
            onClick={handleRestart}
          >
            Start New Movement
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndGameModal;