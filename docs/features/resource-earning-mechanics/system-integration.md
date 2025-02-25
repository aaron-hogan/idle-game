# System Integration: Resource Production and Oppression

This document outlines how the new resource earning mechanics and oppression system work together to create a cohesive gameplay experience.

## Core Systems Interaction

### Resource Flow
```
User Clicks → Resource Generation → Production Rate → Milestone Eligibility
        ↑                   ↓
        |                   |
        ← Automation ← Milestone Rewards
```

### Oppression Dynamics
```
Time Progression → Oppression Growth → Victory/Defeat Conditions
        ↑                   ↓
        |                   |
Resource Production → Resistance Modifiers ← Strategic Actions
```

## Thematic Integration
The combined systems create a compelling gameplay loop that models real-world social movements:

1. **Individual to Collective**: Player begins with manual clicking (individual action) and progresses to automation (collective action)

2. **Resistance and Opposition**: As the movement grows, it faces increasing systemic opposition (oppression)

3. **Strategic Choices**: Player must balance resource production vs. strategic resistance actions

4. **Momentum Building**: Production rate requirements model how movements need momentum to achieve tangible outcomes

5. **Systemic Transformation**: Victory represents how sustained collective action can transform society

## Gameplay Loop

### Early Game (0-15 minutes)
1. Player clicks resources manually (collective power)
2. Low oppression initially gives players breathing room
3. First milestone unlocks when reaching 0.2/s production rate
4. Basic automation reduces clicking requirements
5. Oppression begins growing more noticeably

### Mid Game (15-45 minutes)
1. Automation handles basic resource production
2. Strategic decisions around allocation become important
3. Oppression events introduce critical choices
4. Resource conversion/specialization options appear
5. Player must balance growth vs. resistance

### Late Game (45+ minutes)
1. Complex production chains and synergies emerge
2. Oppression requires active resistance strategies
3. Players make significant strategic choices that shape victory path
4. System-level transformation becomes possible
5. Win condition approaches through sustained resource advantage

## Implementation Integration

### Game Components

#### 1. Main Game UI
The main game UI combines the Resource Production UI with the Oppression Meter:

```typescript
// src/components/GameMain.tsx
import React from 'react';
import ResourceProduction from './resources/ResourceProduction';
import AutomationPanel from './automation/AutomationPanel';
import OppressionMeter from './oppression/OppressionMeter';
import ActionPanel from './actions/ActionPanel';
import EventNotifications from './events/EventNotifications';

const GameMain: React.FC = () => {
  return (
    <div className="game-main">
      <div className="game-header">
        <OppressionMeter />
      </div>
      
      <div className="game-content">
        <div className="resources-column">
          <ResourceProduction />
          <AutomationPanel />
        </div>
        
        <div className="actions-column">
          <ActionPanel />
          <EventNotifications />
        </div>
      </div>
    </div>
  );
};

export default GameMain;
```

#### 2. Event Handling
Events system handles both oppression events and resistance actions:

```typescript
// src/managers/EventManager.ts
import { store } from '../state/store';
import { OppressionSystem } from '../systems/OppressionSystem';
import { ResourceManager } from '../systems/ResourceManager';

export class EventManager {
  // ... existing code ...
  
  public handleOppressionEvent(eventId: string, choiceId?: string): void {
    const event = this.getEventById(eventId);
    if (!event) return;
    
    // Apply basic event effects
    this.applyEventEffects(event.effects);
    
    // If player made a choice, apply choice outcomes
    if (choiceId) {
      const choice = event.choices.find(c => c.id === choiceId);
      if (choice) {
        // Check if player has required resources
        if (this.canAffordCost(choice.cost)) {
          // Deduct resources
          this.deductResourceCost(choice.cost);
          
          // Apply choice outcomes
          this.applyEventEffects(choice.outcomes);
        }
      }
    }
    
    // Mark event as processed
    this.markEventAsProcessed(eventId);
  }
  
  private applyEventEffects(effects: any[]): void {
    if (!effects || effects.length === 0) return;
    
    effects.forEach(effect => {
      switch (effect.type) {
        case 'OPPRESSION_GROWTH':
          // Modify oppression growth rate
          store.dispatch({
            type: 'oppression/addEventModifier',
            payload: {
              modifier: effect.value,
              duration: effect.duration
            }
          });
          break;
          
        case 'OPPRESSION_VALUE':
          // Directly modify oppression value
          const currentOppression = store.getState().oppression.value;
          store.dispatch({
            type: 'oppression/updateOppression',
            payload: {
              value: Math.max(0, currentOppression + effect.value),
              growthRate: store.getState().oppression.currentGrowthRate,
              deltaTime: 0
            }
          });
          break;
          
        case 'PERMANENT_RESISTANCE':
          // Add permanent resistance to oppression
          store.dispatch({
            type: 'oppression/addPermanentResistance',
            payload: {
              value: effect.value
            }
          });
          break;
          
        case 'RESOURCE_GENERATION':
          // Modify resource generation rate
          ResourceManager.getInstance().modifyResourceGeneration(
            effect.resourceId,
            effect.value,
            effect.duration
          );
          break;
          
        case 'RESOURCE_BOOST':
          // Add one-time resource boost
          ResourceManager.getInstance().addResourceAmount(
            effect.resourceId,
            effect.value
          );
          break;
      }
    });
  }
}
```

### Redux Store Integration

The combined systems require several Redux slices working together:

```typescript
// src/state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './resourcesSlice';
import oppressionReducer from './oppressionSlice';
import automationReducer from './automationSlice';
import progressionReducer from './progressionSlice';
import eventsReducer from './eventsSlice';
import gameReducer from './gameSlice';
import { clickTrackingMiddleware } from '../systems/ClickTracker';

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    oppression: oppressionReducer,
    automation: automationReducer,
    progression: progressionReducer,
    events: eventsReducer,
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(clickTrackingMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Game Initialization

```typescript
// src/systems/GameInitializer.ts
import { store } from '../state/store';
import { INITIAL_RESOURCES } from '../constants/resources';
import { INITIAL_AUTOMATIONS } from '../constants/automations';
import { allMilestones } from '../data/progression/milestones';
import { OppressionSystem } from './OppressionSystem';
import { ProgressionManager } from '../managers/progression/ProgressionManager';

export class GameInitializer {
  public static initializeGame(): void {
    // Initialize resources
    Object.values(INITIAL_RESOURCES).forEach(resource => {
      store.dispatch({
        type: 'resources/addResource',
        payload: resource
      });
    });
    
    // Initialize automation options (locked initially)
    Object.values(INITIAL_AUTOMATIONS).forEach(automation => {
      store.dispatch({
        type: 'automation/addAutomation',
        payload: automation
      });
    });
    
    // Initialize progression system
    allMilestones.forEach(milestone => {
      store.dispatch({
        type: 'progression/addMilestone',
        payload: milestone
      });
    });
    
    // Initialize oppression
    store.dispatch({
      type: 'oppression/updateOppression',
      payload: {
        value: 5, // Starting oppression value
        growthRate: 0.02,
        deltaTime: 0
      }
    });
    
    // Initialize game state
    store.dispatch({
      type: 'game/setGameState',
      payload: {
        isRunning: true,
        startDate: Date.now(),
        totalPlayTime: 0
      }
    });
  }
}
```

## Testing Strategy

### Resource Clicking Testing
```typescript
// src/tests/ResourceClickingTest.ts
import { store } from '../state/store';
import { ClickTracker } from '../systems/ClickTracker';

export const testResourceClicking = () => {
  // Simulate clicking at different rates
  const resourceId = 'collective-power';
  const clickAmount = 0.2;
  
  // Test 1: Slow clicking (1 click every 2 seconds for 10 seconds)
  console.log('--- Test 1: Slow Clicking ---');
  const startAmount1 = store.getState().resources.byId[resourceId].amount;
  
  for (let i = 0; i < 5; i++) {
    store.dispatch({
      type: 'resources/addResourceAmount',
      payload: {
        id: resourceId,
        amount: clickAmount
      }
    });
    
    ClickTracker.getInstance().recordClick(resourceId, clickAmount);
    
    // Wait 2 seconds between clicks
    console.log(`Click ${i+1}: Amount ${store.getState().resources.byId[resourceId].amount.toFixed(2)}`);
  }
  
  const endAmount1 = store.getState().resources.byId[resourceId].amount;
  const rate1 = ClickTracker.getInstance().getClickRate(resourceId);
  console.log(`Total added: ${(endAmount1 - startAmount1).toFixed(2)}`);
  console.log(`Click rate: ${rate1.toFixed(2)}/s`);
  
  // Test 2: Fast clicking (5 clicks per second for 2 seconds)
  console.log('\n--- Test 2: Fast Clicking ---');
  store.dispatch({ type: 'resources/resetResources' });
  const startAmount2 = store.getState().resources.byId[resourceId].amount;
  
  for (let i = 0; i < 10; i++) {
    store.dispatch({
      type: 'resources/addResourceAmount',
      payload: {
        id: resourceId,
        amount: clickAmount
      }
    });
    
    ClickTracker.getInstance().recordClick(resourceId, clickAmount);
    
    // No waiting between clicks
    console.log(`Click ${i+1}: Amount ${store.getState().resources.byId[resourceId].amount.toFixed(2)}`);
  }
  
  const endAmount2 = store.getState().resources.byId[resourceId].amount;
  const rate2 = ClickTracker.getInstance().getClickRate(resourceId);
  console.log(`Total added: ${(endAmount2 - startAmount2).toFixed(2)}`);
  console.log(`Click rate: ${rate2.toFixed(2)}/s`);
};
```

### Oppression Growth Testing
```typescript
// src/tests/OppressionGrowthTest.ts
import { store } from '../state/store';
import { OppressionSystem } from '../systems/OppressionSystem';

export const testOppressionGrowth = () => {
  // Set up initial conditions
  store.dispatch({
    type: 'oppression/updateOppression',
    payload: {
      value: 10,
      growthRate: 0.02,
      deltaTime: 0
    }
  });
  
  store.dispatch({
    type: 'resources/addResourceAmount',
    payload: {
      id: 'collective-power',
      amount: 50
    }
  });
  
  // Test 1: Basic growth over time
  console.log('--- Test 1: Basic Oppression Growth ---');
  const initialOppression = store.getState().oppression.value;
  console.log(`Initial oppression: ${initialOppression.toFixed(2)}`);
  
  // Simulate 10 minutes of growth
  for (let i = 1; i <= 10; i++) {
    OppressionSystem.getInstance().updateOppression(60000); // 1 minute
    const currentOppression = store.getState().oppression.value;
    console.log(`After ${i} minutes: ${currentOppression.toFixed(2)}`);
  }
  
  // Test 2: Growth with resistance
  console.log('\n--- Test 2: Growth with Resistance ---');
  
  // Reset oppression
  store.dispatch({
    type: 'oppression/updateOppression',
    payload: {
      value: 10,
      growthRate: 0.02,
      deltaTime: 0
    }
  });
  
  // Add resistance factors
  store.dispatch({
    type: 'resources/addResourceAmount',
    payload: {
      id: 'solidarity',
      amount: 100
    }
  });
  
  store.dispatch({
    type: 'resources/addResourceAmount',
    payload: {
      id: 'community-trust',
      amount: 50
    }
  });
  
  store.dispatch({
    type: 'oppression/addPermanentResistance',
    payload: {
      value: 0.2
    }
  });
  
  const initialOppression2 = store.getState().oppression.value;
  console.log(`Initial oppression: ${initialOppression2.toFixed(2)}`);
  
  // Simulate 10 minutes of growth with resistance
  for (let i = 1; i <= 10; i++) {
    OppressionSystem.getInstance().updateOppression(60000); // 1 minute
    const currentOppression = store.getState().oppression.value;
    console.log(`After ${i} minutes: ${currentOppression.toFixed(2)}`);
  }
};
```

### Balance Testing
```typescript
// src/tests/GameBalanceTest.ts
import { store } from '../state/store';
import { OppressionSystem } from '../systems/OppressionSystem';
import { ClickTracker } from '../systems/ClickTracker';
import { AutomationSystem } from '../systems/AutomationSystem';

export const testGameBalance = () => {
  // Initialize game with standard starting conditions
  
  console.log('--- Game Balance Simulation ---');
  
  // Simulate early game (first 15 minutes)
  console.log('\nEarly Game Simulation:');
  
  // Player clicks 2 times per second for 2 minutes
  for (let i = 0; i < 240; i++) {
    store.dispatch({
      type: 'resources/addResourceAmount',
      payload: {
        id: 'collective-power',
        amount: 0.2
      }
    });
    
    ClickTracker.getInstance().recordClick('collective-power', 0.2);
    
    // Every 30 clicks, update game systems
    if (i % 30 === 0) {
      OppressionSystem.getInstance().updateOppression(15000); // 15 seconds
      AutomationSystem.getInstance().updateResourceProduction();
      
      // Log current state
      const state = store.getState();
      console.log(`Time ${(i/30) * 15}s: Collective Power: ${state.resources.byId['collective-power'].amount.toFixed(1)}, Oppression: ${state.oppression.value.toFixed(1)}`);
    }
  }
  
  // Unlock first automation
  store.dispatch({
    type: 'automation/setAutomationUnlocked',
    payload: {
      id: 'basic-organizing',
      unlocked: true
    }
  });
  
  store.dispatch({
    type: 'automation/upgradeAutomation',
    payload: {
      id: 'basic-organizing'
    }
  });
  
  // Simulate mid game (reduced clicking, more automation)
  console.log('\nMid Game Simulation:');
  
  // Player clicks 1 time per second for 5 minutes
  for (let i = 0; i < 300; i++) {
    // Click only every other second
    if (i % 2 === 0) {
      store.dispatch({
        type: 'resources/addResourceAmount',
        payload: {
          id: 'collective-power',
          amount: 0.2
        }
      });
      
      ClickTracker.getInstance().recordClick('collective-power', 0.2);
    }
    
    // Every 30 ticks, update game systems
    if (i % 30 === 0) {
      OppressionSystem.getInstance().updateOppression(30000); // 30 seconds
      AutomationSystem.getInstance().updateResourceProduction();
      
      // Log current state
      const state = store.getState();
      console.log(`Time ${2*60 + (i/30) * 30}s: Collective Power: ${state.resources.byId['collective-power'].amount.toFixed(1)}, Oppression: ${state.oppression.value.toFixed(1)}`);
    }
  }
};
```

## User Experience Path
The following outlines a typical user path through the game with these integrated systems:

1. **First Experience (0-5 minutes)**
   - User clicks collective power resource to start accumulating
   - Sees oppression meter with very low initial oppression
   - Notices resources have natural decay, requiring continued clicking
   - Discovers clicking faster increases production rate

2. **First Milestone (5-10 minutes)**
   - Achieves 0.2/s production rate through consistent clicking
   - Unlocks first milestone "First Collective Power"
   - Gains basic automation that reduces clicking requirements
   - Notices oppression beginning to grow more quickly

3. **Strategic Choices (10-20 minutes)**
   - Faces first oppression event requiring a choice
   - Must balance between growing resources vs. resisting oppression
   - Unlocks solidarity resource that helps resist oppression
   - Develops basic resource production strategy

4. **Mid-Game Development (20-40 minutes)**
   - Accumulates enough resources to unlock significant automation
   - Oppression becomes a serious threat requiring active management
   - Strategic actions become critical for survival
   - Resource conversion and specialization options emerge

5. **Late Game Transformation (40+ minutes)**
   - Complex production chains with multiple resources
   - Systemic resistance strategies against advanced oppression
   - Major milestone achievements transform game mechanics
   - Path to victory becomes clear through sustained advantage

This path creates a compelling progression that mirrors real social movements: from individual action to collective organization, facing increasing opposition, and ultimately creating systemic transformation.