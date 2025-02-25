# Resource Earning Mechanics - Implementation Guide

## Overview
This guide outlines the technical implementation of the enhanced resource earning mechanics, including clickable resources, production thresholds for milestone eligibility, and automation rewards.

## Core Components

### 1. Resource Clicking System

#### Resource Component Enhancement
```typescript
// src/components/resources/ResourceItem.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addResourceAmount } from '../../state/resourcesSlice';
import { Resource } from '../../models/resource';
import './ResourceItem.css';

interface ResourceItemProps {
  resource: Resource;
  clickValue: number;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource, clickValue }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    // Add resource amount based on click value
    dispatch(addResourceAmount({
      id: resource.id,
      amount: clickValue
    }));
    
    // Trigger click animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Track click in analytics
    dispatch({
      type: 'tracking/resourceClicked',
      payload: {
        resourceId: resource.id,
        amount: clickValue,
        timestamp: Date.now()
      }
    });
  };
  
  return (
    <div 
      className={`resource-item ${isAnimating ? 'resource-clicked' : ''}`}
      onClick={handleClick}
    >
      <div className="resource-icon">{resource.icon || '⚡'}</div>
      <div className="resource-info">
        <div className="resource-name">{resource.name}</div>
        <div className="resource-amount">{resource.amount.toFixed(1)}</div>
        <div className="resource-rate">
          {resource.perSecond >= 0 ? '+' : ''}{resource.perSecond.toFixed(2)}/s
        </div>
      </div>
    </div>
  );
};

export default ResourceItem;
```

#### Click Tracking System
```typescript
// src/systems/ClickTracker.ts
import { store } from '../state/store';

interface ClickRecord {
  timestamp: number;
  resourceId: string;
  amount: number;
}

export class ClickTracker {
  private static instance: ClickTracker | null = null;
  private clickHistory: Map<string, ClickRecord[]> = new Map();
  private readonly HISTORY_WINDOW = 60000; // 1 minute in ms
  
  private constructor() {}
  
  public static getInstance(): ClickTracker {
    if (!ClickTracker.instance) {
      ClickTracker.instance = new ClickTracker();
    }
    return ClickTracker.instance;
  }
  
  public recordClick(resourceId: string, amount: number): void {
    const now = Date.now();
    if (!this.clickHistory.has(resourceId)) {
      this.clickHistory.set(resourceId, []);
    }
    
    const history = this.clickHistory.get(resourceId)!;
    history.push({ timestamp: now, resourceId, amount });
    
    // Clean up old records
    this.pruneHistory(resourceId);
  }
  
  private pruneHistory(resourceId: string): void {
    const now = Date.now();
    const cutoff = now - this.HISTORY_WINDOW;
    const history = this.clickHistory.get(resourceId)!;
    
    const newHistory = history.filter(record => record.timestamp >= cutoff);
    this.clickHistory.set(resourceId, newHistory);
  }
  
  public getClickRate(resourceId: string): number {
    if (!this.clickHistory.has(resourceId)) {
      return 0;
    }
    
    this.pruneHistory(resourceId);
    const history = this.clickHistory.get(resourceId)!;
    
    if (history.length < 2) {
      return 0;
    }
    
    const totalAmount = history.reduce((sum, record) => sum + record.amount, 0);
    const timeSpan = (Date.now() - history[0].timestamp) / 1000; // in seconds
    
    return timeSpan > 0 ? totalAmount / timeSpan : 0;
  }
}

// Middleware to track clicks
export const clickTrackingMiddleware = store => next => action => {
  if (action.type === 'tracking/resourceClicked') {
    const { resourceId, amount } = action.payload;
    ClickTracker.getInstance().recordClick(resourceId, amount);
  }
  
  return next(action);
};
```

### 2. Production Rate Milestone Requirements

#### Enhanced Milestone Interface
```typescript
// src/interfaces/progression/index.ts

// Add to existing StageRequirement interface
export interface StageRequirement {
  // Existing properties...
  
  /** Type of requirement (e.g., 'resourceAmount', 'resourceRate', 'milestonesCompleted') */
  type: string;
  
  /** Target of the requirement (e.g., resource ID, milestone category) */
  target?: string;
  
  /** Value to compare against */
  value: number | boolean | string;
  
  /** Optional comparison operator (default: '>=' ) */
  operator?: '>=' | '>' | '=' | '<' | '<=';
}
```

#### Updated Milestone Definitions
```typescript
// src/data/progression/milestones.ts

// Modify existing milestone
{
  id: 'first-collective-power',
  name: 'First Collective Power',
  description: 'Begin your journey by generating consistent collective bargaining power.',
  stage: GameStage.EARLY,
  type: MilestoneType.AWARENESS,
  completed: false,
  requirements: [
    {
      type: 'resourceRate', // New requirement type
      target: 'collective-power',
      value: 0.2 // Minimum production rate required
    }
  ],
  unlocks: ['basic-automation'],
  order: 1,
  visible: true
}
```

#### ProgressionManager Enhancement
```typescript
// src/managers/progression/ProgressionManager.ts

// Add to evaluateRequirement method
private evaluateRequirement(requirement: StageRequirement): boolean {
  try {
    const { type, target, value, operator = '>=' } = requirement;
    const state = store.getState();

    switch (type) {
      // Existing cases...
      
      case 'resourceRate': {
        if (!target) {
          this.debugLog(`Warning: No target provided for resourceRate requirement`);
          return false;
        }
        
        try {
          const resources = state.resources.byId;
          if (!resources || !target) {
            this.debugLog(`Warning: Resources not available or target is undefined`);
            return false;
          }
          
          const resource = resources[target as string];
          if (!resource) {
            this.debugLog(`Warning: Resource ${target} not found`);
            return false;
          }
          
          // Get production rate - could be from click tracking or other sources
          let productionRate = resource.perSecond;
          
          // If using click tracking
          const clickRate = ClickTracker.getInstance().getClickRate(target as string);
          productionRate += clickRate;
          
          return this.compareValues(productionRate, value, operator);
        } catch (error) {
          this.debugLog(`Error accessing resource rate ${target}: ${error}`);
          return false;
        }
      }
      
      // Other cases...
    }
  } catch (error) {
    console.error('Error evaluating requirement:', error);
    return false;
  }
}
```

### 3. Resource Net-Neutral Balance

#### Resource Update
```typescript
// src/constants/resources.ts
export const INITIAL_RESOURCES: Record<string, Resource> = {
  'collective-power': {
    id: 'collective-power',
    name: 'Collective Bargaining Power',
    amount: 0,
    maxAmount: 1000,
    perSecond: -0.05, // Slight decay to encourage activity
    baseDecayRate: -0.05, // Store base decay for reference
    description: 'The core resource representing the movement\'s ability to negotiate and demand change',
    unlocked: true,
    category: 'PRIMARY',
  },
  // Other resources...
}
```

#### Resource Decay System
```typescript
// src/systems/ResourceDecaySystem.ts
import { store } from '../state/store';
import { updateResourcePerSecond } from '../state/resourcesSlice';

export class ResourceDecaySystem {
  private static instance: ResourceDecaySystem | null = null;
  
  private constructor() {}
  
  public static getInstance(): ResourceDecaySystem {
    if (!ResourceDecaySystem.instance) {
      ResourceDecaySystem.instance = new ResourceDecaySystem();
    }
    return ResourceDecaySystem.instance;
  }
  
  public updateResourceDecay(resourceId: string, modifiers: number[]): void {
    const state = store.getState();
    const resource = state.resources.byId[resourceId];
    
    if (!resource) return;
    
    // Get base decay rate
    const baseDecayRate = resource.baseDecayRate || 0;
    
    // Calculate total modifier (from automation, upgrades, etc.)
    const totalModifier = modifiers.reduce((sum, mod) => sum + mod, 0);
    
    // Calculate new per-second rate
    const newPerSecond = baseDecayRate + totalModifier;
    
    // Update the resource
    store.dispatch(updateResourcePerSecond({
      id: resourceId,
      perSecond: newPerSecond
    }));
  }
}
```

### 4. Automation as Progression Reward

#### Automation Interface
```typescript
// src/interfaces/automation.ts
export interface AutomationLevel {
  id: string;
  resourceId: string;
  name: string;
  level: number;
  productionBonus: number;
  cost: Record<string, number>;
  maxLevel: number;
  description: string;
  unlocked: boolean;
}

export interface AutomationState {
  byId: Record<string, AutomationLevel>;
  allIds: string[];
}
```

#### Automation Redux Slice
```typescript
// src/state/automationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AutomationState, AutomationLevel } from '../interfaces/automation';

const initialState: AutomationState = {
  byId: {},
  allIds: []
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    addAutomation: (state, action: PayloadAction<AutomationLevel>) => {
      const automation = action.payload;
      state.byId[automation.id] = automation;
      if (!state.allIds.includes(automation.id)) {
        state.allIds.push(automation.id);
      }
    },
    
    upgradeAutomation: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const automation = state.byId[id];
      
      if (automation && automation.level < automation.maxLevel) {
        automation.level += 1;
        automation.productionBonus *= 1.5; // Increase bonus with each level
      }
    },
    
    setAutomationUnlocked: (state, action: PayloadAction<{ id: string; unlocked: boolean }>) => {
      const { id, unlocked } = action.payload;
      if (state.byId[id]) {
        state.byId[id].unlocked = unlocked;
      }
    }
  }
});

export const { addAutomation, upgradeAutomation, setAutomationUnlocked } = automationSlice.actions;
export default automationSlice.reducer;
```

#### Automation System
```typescript
// src/systems/AutomationSystem.ts
import { store } from '../state/store';
import { ResourceDecaySystem } from './ResourceDecaySystem';

export class AutomationSystem {
  private static instance: AutomationSystem | null = null;
  
  private constructor() {}
  
  public static getInstance(): AutomationSystem {
    if (!AutomationSystem.instance) {
      AutomationSystem.instance = new AutomationSystem();
    }
    return AutomationSystem.instance;
  }
  
  public updateResourceProduction(): void {
    const state = store.getState();
    const automations = state.automation?.byId || {};
    
    // Group automations by resource
    const resourceModifiers: Record<string, number[]> = {};
    
    // Calculate modifiers from automation
    Object.values(automations).forEach(automation => {
      if (!automation.unlocked || automation.level === 0) return;
      
      const { resourceId, productionBonus } = automation;
      
      if (!resourceModifiers[resourceId]) {
        resourceModifiers[resourceId] = [];
      }
      
      resourceModifiers[resourceId].push(productionBonus);
    });
    
    // Apply modifiers to resources
    Object.entries(resourceModifiers).forEach(([resourceId, modifiers]) => {
      ResourceDecaySystem.getInstance().updateResourceDecay(resourceId, modifiers);
    });
  }
}
```

### 5. Integration with Game Loop

```typescript
// src/core/GameLoop.ts

// Add to existing tick method
private tick(deltaTime: number): void {
  // Existing game loop code...
  
  // Update click rates
  const resources = Object.keys(this.store.getState().resources.byId);
  resources.forEach(resourceId => {
    ClickTracker.getInstance().getClickRate(resourceId);
  });
  
  // Update automation effects
  AutomationSystem.getInstance().updateResourceProduction();
  
  // Check milestone requirements including production rates
  ProgressionManager.getInstance().checkAllProgressionItems();
}
```

## UI Implementation Examples

### Click Animation CSS
```css
/* src/components/resources/ResourceItem.css */
.resource-item {
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  position: relative;
}

.resource-clicked {
  transform: scale(1.05);
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.resource-click-value {
  position: absolute;
  color: #4caf50;
  font-weight: bold;
  animation: float-up 0.8s ease-out forwards;
  opacity: 0;
  pointer-events: none;
}

@keyframes float-up {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-30px); opacity: 0; }
}
```

### Production Rate Indicator
```tsx
// src/components/resources/ProductionRateIndicator.tsx
import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';
import { ClickTracker } from '../../systems/ClickTracker';
import './ProductionRateIndicator.css';

interface ProductionRateIndicatorProps {
  resourceId: string;
  requiredRate: number;
}

const ProductionRateIndicator: React.FC<ProductionRateIndicatorProps> = ({ 
  resourceId, 
  requiredRate 
}) => {
  const resource = useAppSelector(state => state.resources.byId[resourceId]);
  const clickRate = ClickTracker.getInstance().getClickRate(resourceId);
  const totalRate = (resource?.perSecond || 0) + clickRate;
  
  const percentComplete = Math.min(100, (totalRate / requiredRate) * 100);
  const isEligible = totalRate >= requiredRate;
  
  return (
    <div className="production-rate-indicator">
      <div className="rate-label">
        Production Rate: {totalRate.toFixed(2)}/s
        {isEligible && <span className="eligible-badge">✓</span>}
      </div>
      <div className="threshold-label">
        Required: {requiredRate.toFixed(2)}/s
      </div>
      <div className="progress-container">
        <div 
          className={`progress-bar ${isEligible ? 'eligible' : ''}`}
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
};

export default ProductionRateIndicator;
```

## Testing Implementation

```typescript
// src/components/resources/ResourceItem.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResourceItem from './ResourceItem';
import { addResourceAmount } from '../../state/resourcesSlice';

// Mock store
const mockStore = configureStore([]);

describe('ResourceItem Component', () => {
  let store;
  const resource = {
    id: 'collective-power',
    name: 'Collective Power',
    amount: 10,
    maxAmount: 100,
    perSecond: 0.1,
    description: 'Test resource',
    unlocked: true,
    category: 'PRIMARY'
  };
  
  beforeEach(() => {
    store = mockStore({
      resources: { byId: { 'collective-power': resource } }
    });
    store.dispatch = jest.fn();
  });
  
  it('should render the resource information', () => {
    render(
      <Provider store={store}>
        <ResourceItem resource={resource} clickValue={1} />
      </Provider>
    );
    
    expect(screen.getByText('Collective Power')).toBeInTheDocument();
    expect(screen.getByText('10.0')).toBeInTheDocument();
    expect(screen.getByText('+0.10/s')).toBeInTheDocument();
  });
  
  it('should dispatch addResourceAmount when clicked', () => {
    render(
      <Provider store={store}>
        <ResourceItem resource={resource} clickValue={1} />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Collective Power'));
    
    expect(store.dispatch).toHaveBeenCalledWith(addResourceAmount({
      id: 'collective-power',
      amount: 1
    }));
  });
  
  it('should have the clicked class briefly when clicked', () => {
    jest.useFakeTimers();
    
    render(
      <Provider store={store}>
        <ResourceItem resource={resource} clickValue={1} />
      </Provider>
    );
    
    const resourceItem = screen.getByText('Collective Power').closest('.resource-item');
    fireEvent.click(resourceItem);
    
    expect(resourceItem).toHaveClass('resource-clicked');
    
    jest.advanceTimersByTime(300);
    
    expect(resourceItem).not.toHaveClass('resource-clicked');
  });
});
```