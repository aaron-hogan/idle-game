import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TabNavigation.css';

export interface NavTab {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

interface TabNavigationProps {
  tabs: NavTab[];
}

/**
 * Navigation tabs for switching between game pages
 */
const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  const location = useLocation();
  
  return (
    <nav className="tab-navigation">
      <div className="tab-container">
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => 
              `nav-tab ${isActive ? 'active' : ''}`
            }
            aria-label={tab.label}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

// Default tabs configuration
export const DEFAULT_TABS: NavTab[] = [
  {
    id: 'main',
    label: 'Main',
    path: '/',
    icon: '🏠'
  },
  {
    id: 'upgrades',
    label: 'Upgrades',
    path: '/upgrades',
    icon: '⬆️'
  },
  {
    id: 'progression',
    label: 'Progress',
    path: '/progression',
    icon: '📊'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: '⚙️'
  }
];

export default TabNavigation;