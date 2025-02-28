import React from 'react';
import TabSystem from './components/TabSystem';
import GameLoopDebugTab from './tabs/GameLoopDebugTab';
import ResourceDebugTab from './tabs/ResourceDebugTab';
import ProgressionDebugTab from './tabs/ProgressionDebugTab';
import EventDebugTab from './tabs/EventDebugTab';
import TutorialDebugTab from './tabs/TutorialDebugTab';
import '../styles/debug.css';

/**
 * Main Game Debugger component
 * Provides a tabbed interface for various debug panels
 */
const GameDebugger: React.FC = () => {
  // Initialize with tabs
  const tabs = [
    {
      id: 'gameLoop',
      label: 'Game Loop',
      content: <GameLoopDebugTab />,
    },
    {
      id: 'resources',
      label: 'Resources',
      content: <ResourceDebugTab />,
    },
    {
      id: 'progression',
      label: 'Progression',
      content: <ProgressionDebugTab />,
    },
    {
      id: 'events',
      label: 'Events',
      content: <EventDebugTab />,
    },
    {
      id: 'tutorial',
      label: 'Tutorial',
      content: <TutorialDebugTab />,
    },
  ];

  // Control visibility - always show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="debugger-container bare-debugger">
      <TabSystem tabs={tabs} defaultTabId="resources" />
    </div>
  );
};

export default GameDebugger;
