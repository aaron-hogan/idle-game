import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabSystemProps {
  tabs: Tab[];
  defaultTabId?: string;
}

/**
 * A reusable tab system component for the debugger
 */
const TabSystem: React.FC<TabSystemProps> = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTabId || tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Find the active tab
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="tab-system">
      <div className="debugger-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`debugger-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="debugger-content">
        {activeTabContent}
      </div>
    </div>
  );
};

export default TabSystem;