import React, { useState, useEffect } from 'react';
import './TabGroup.css';

interface TabGroupProps {
  children: React.ReactNode;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

interface TabProps {
  id: string;
  label: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabElement extends React.ReactElement<TabProps> {
  props: TabProps;
}

const TabGroup: React.FC<TabGroupProps> = ({
  children,
  activeTab,
  onChange,
  className = '',
}) => {
  // State to track the active tab
  const [currentTab, setCurrentTab] = useState<string | undefined>(activeTab);
  
  // Update current tab when activeTab prop changes
  useEffect(() => {
    if (activeTab !== undefined) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);
  
  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Filter and validate children to ensure they are Tab components
  const validTabs: TabElement[] = [];
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<TabProps>(child) && 
        typeof child.props.id === 'string' && 
        typeof child.props.label === 'string') {
      validTabs.push(child as TabElement);
    }
  });
  
  // If no tabs are provided, render nothing
  if (validTabs.length === 0) {
    return null;
  }
  
  // If no tab is selected, default to the first tab
  const activeTabId = currentTab || (validTabs[0]?.props.id);
  
  // Combine the classes
  const tabGroupClasses = ['tab-group', className].filter(Boolean).join(' ');
  
  return (
    <div className={tabGroupClasses} role="tablist">
      {validTabs.map((tab) => {
        return React.cloneElement(tab, {
          key: tab.props.id,
          isActive: tab.props.id === activeTabId,
          onClick: handleTabClick,
        });
      })}
    </div>
  );
};

export default TabGroup;