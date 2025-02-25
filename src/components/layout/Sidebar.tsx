import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? '»' : '«'}
      </button>
      <div className="sidebar-content">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;