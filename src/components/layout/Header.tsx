import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectGameStage } from '../../state/selectors';
import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Anti-Capitalist Idle Game' }) => {
  const gameStage = useAppSelector(selectGameStage);
  
  const stageLabels = [
    'Organizing & Education',
    'Direct Action & Resistance',
    'Revolutionary Activity'
  ];
  
  const currentStageLabel = stageLabels[Math.min(gameStage, stageLabels.length - 1)];
  
  return (
    <header className="game-header">
      <div className="header-content">
        <h1>{title}</h1>
        <div className="stage-indicator">
          <span className="stage-label">Stage {gameStage + 1}:</span>
          <span className="stage-name">{currentStageLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;