import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectTotalPlayTime } from '../../state/selectors';
import { formatTime } from '../../utils/timeUtils';
import './Footer.css';

const Footer: React.FC = () => {
  const totalPlayTime = useAppSelector(selectTotalPlayTime);

  return (
    <footer className="game-footer">
      <div className="footer-content">
        <div className="play-time">
          <span>Total Play Time: {formatTime(totalPlayTime)}</span>
        </div>
        <div className="copyright">
          <span>© 2025 Anti-Capitalist Idle Game</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
