import React, { useState } from 'react';
import './Tabs.css';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  onChange,
  className = '',
  tabClassName = '',
  contentClassName = '',
}) => {
  const initialTab = defaultActiveTab || (items.length > 0 ? items[0].id : '');
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTabContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tab-button ${activeTab === item.id ? 'tab-active' : ''} ${item.disabled ? 'tab-disabled' : ''} ${tabClassName}`}
            onClick={() => !item.disabled && handleTabClick(item.id)}
            aria-selected={activeTab === item.id}
            aria-disabled={item.disabled}
            role="tab"
            tabIndex={activeTab === item.id ? 0 : -1}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`tab-content ${contentClassName}`} role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
