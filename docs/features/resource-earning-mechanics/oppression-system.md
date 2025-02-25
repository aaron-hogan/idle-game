# Oppression System Design

## Concept Overview
Oppression represents the systemic forces working against social movements. It gradually accumulates over time and can eventually overcome the player's resources, ending the game. Successfully building enough resources and momentum allows players to overcome oppression and advance the movement.

## Thematic Integration
The oppression system creates a compelling narrative framework that aligns with anti-capitalist themes:
- Reflects real-world resistance to social movements
- Creates meaningful stakes and consequences
- Forces strategic prioritization of resources
- Models how movements must continuously grow to survive
- Demonstrates how capitalism naturally seeks to suppress alternatives

## Core Mechanics

### Oppression Resource
- Global counter representing systemic opposition
- Gradually increases over time at an exponential rate
- Acts as a persistent threat to player progress
- Creates urgency and strategic pressure

### Victory and Defeat Conditions
- **Defeat**: When oppression exceeds total collective power, the movement is crushed
- **Victory Stage Advancement**: When collective resources sufficiently exceed oppression, player advances to next game stage
- **Ultimate Victory**: Complete transformation of society by overwhelming oppression entirely

### Resource Interaction
- Oppression directly counteracts collective power
- Certain resources (solidarity, community trust) provide resistance multipliers against oppression
- Strategic actions can temporarily reduce oppression growth rate
- Some milestone achievements create permanent reductions to oppression growth

## Implementation Details

### Oppression Generation
```typescript
// src/systems/OppressionSystem.ts
import { store } from '../state/store';
import { updateOppression } from '../state/oppressionSlice';
import { GameStage } from '../interfaces/progression';

export class OppressionSystem {
  private static instance: OppressionSystem | null = null;
  
  // Base growth rate per stage
  private readonly BASE_GROWTH_RATES: Record<GameStage, number> = {
    [GameStage.EARLY]: 0.02,    // 2% growth per minute in early game
    [GameStage.MID]: 0.035,     // 3.5% growth per minute in mid game
    [GameStage.LATE]: 0.05,     // 5% growth per minute in late game
    [GameStage.END_GAME]: 0.08  // 8% growth per minute in end game
  };
  
  private constructor() {}
  
  public static getInstance(): OppressionSystem {
    if (!OppressionSystem.instance) {
      OppressionSystem.instance = new OppressionSystem();
    }
    return OppressionSystem.instance;
  }
  
  public updateOppression(deltaTime: number): void {
    const state = store.getState();
    const currentStage = state.progression.currentStage;
    const currentOppression = state.oppression.value;
    const baseGrowthRate = this.BASE_GROWTH_RATES[currentStage] || this.BASE_GROWTH_RATES[GameStage.EARLY];
    
    // Calculate modifiers from various sources
    const resistanceModifier = this.calculateResistanceModifier(state);
    const eventModifier = state.oppression.eventModifiers.reduce((total, mod) => total + mod, 0);
    const timeModifier = Math.log10(Math.max(10, state.game.totalPlayTime / 60000)) * 0.2;
    
    // Combined growth rate
    const growthRate = baseGrowthRate * (1 + timeModifier) * (1 - resistanceModifier) + eventModifier;
    
    // Calculate new oppression value (compound growth)
    // We divide by 60000 to convert from ms to minutes
    const growth = currentOppression * growthRate * (deltaTime / 60000);
    const newOppression = currentOppression + growth;
    
    // Update state
    store.dispatch(updateOppression({
      value: newOppression,
      growthRate,
      deltaTime
    }));
    
    // Check for game over condition
    this.checkOppressionLevels();
  }
  
  private calculateResistanceModifier(state: any): number {
    // Calculate resistance from resources
    let resistanceModifier = 0;
    
    // Solidarity provides resistance
    const solidarity = state.resources.byId['solidarity']?.amount || 0;
    resistanceModifier += solidarity * 0.0002; // 0.02% per solidarity point
    
    // Community trust provides resistance
    const communityTrust = state.resources.byId['community-trust']?.amount || 0;
    resistanceModifier += communityTrust * 0.0003; // 0.03% per community trust point
    
    // Unlocked milestones provide resistance
    const completedMilestones = Object.values(state.progression.milestones)
      .filter((m: any) => m.completed)
      .length;
    resistanceModifier += completedMilestones * 0.01; // 1% per completed milestone
    
    // Cap resistance at 90% to prevent complete immunity
    return Math.min(0.9, resistanceModifier);
  }
  
  private checkOppressionLevels(): void {
    const state = store.getState();
    const oppression = state.oppression.value;
    const collectivePower = state.resources.byId['collective-power']?.amount || 0;
    
    // Check for game over (oppression overwhelms collective power)
    if (oppression > collectivePower * 1.5) {
      store.dispatch({
        type: 'game/setGameOver',
        payload: {
          reason: 'OPPRESSION_OVERWHELMING',
          message: 'The movement has been overwhelmed by systemic oppression.',
          timestamp: Date.now()
        }
      });
    }
    
    // Check for stage advancement opportunity
    const currentStage = state.progression.currentStage;
    if (currentStage !== GameStage.END_GAME && collectivePower > oppression * 2) {
      // Player has overcome oppression enough to advance
      const nextStage = this.getNextStage(currentStage);
      if (nextStage) {
        store.dispatch({
          type: 'progression/advanceGameStage',
          payload: {
            stage: nextStage,
            reachedAt: Date.now()
          }
        });
        
        // Apply stage transition effect
        this.applyStageTransitionEffect(nextStage);
      }
    }
  }
  
  private getNextStage(currentStage: GameStage): GameStage | null {
    switch (currentStage) {
      case GameStage.EARLY:
        return GameStage.MID;
      case GameStage.MID:
        return GameStage.LATE;
      case GameStage.LATE:
        return GameStage.END_GAME;
      default:
        return null;
    }
  }
  
  private applyStageTransitionEffect(newStage: GameStage): void {
    // Reset oppression partially on stage transition
    const state = store.getState();
    const currentOppression = state.oppression.value;
    
    // Reduce oppression by a percentage based on new stage
    let reductionFactor = 0;
    switch (newStage) {
      case GameStage.MID:
        reductionFactor = 0.3; // 30% reduction
        break;
      case GameStage.LATE:
        reductionFactor = 0.4; // 40% reduction
        break;
      case GameStage.END_GAME:
        reductionFactor = 0.5; // 50% reduction
        break;
    }
    
    const newOppression = currentOppression * (1 - reductionFactor);
    
    store.dispatch(updateOppression({
      value: newOppression,
      growthRate: this.BASE_GROWTH_RATES[newStage],
      deltaTime: 0
    }));
    
    // Add transition event
    store.dispatch({
      type: 'events/addEvent',
      payload: {
        id: `stage-transition-${Date.now()}`,
        title: `Movement Reaches New Stage: ${this.getStageName(newStage)}`,
        description: `Your movement has overcome systemic opposition and reached a new stage of development! Oppression forces have been temporarily weakened by ${reductionFactor * 100}%.`,
        timestamp: Date.now(),
        type: 'MILESTONE',
        effects: [
          {
            type: 'OPPRESSION_REDUCTION',
            value: reductionFactor
          }
        ],
        read: false
      }
    });
  }
  
  private getStageName(stage: GameStage): string {
    switch (stage) {
      case GameStage.EARLY:
        return 'Early Organization';
      case GameStage.MID:
        return 'Growing Movement';
      case GameStage.LATE:
        return 'Systemic Challenge';
      case GameStage.END_GAME:
        return 'Revolutionary Potential';
      default:
        return 'Unknown Stage';
    }
  }
}
```

### Oppression Redux Slice
```typescript
// src/state/oppressionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OppressionState {
  value: number;
  baseGrowthRate: number;
  currentGrowthRate: number;
  eventModifiers: number[];
  permanentResistance: number;
  lastUpdated: number;
}

const initialState: OppressionState = {
  value: 5, // Starting oppression value
  baseGrowthRate: 0.02, // 2% per minute base growth
  currentGrowthRate: 0.02,
  eventModifiers: [],
  permanentResistance: 0,
  lastUpdated: Date.now()
};

const oppressionSlice = createSlice({
  name: 'oppression',
  initialState,
  reducers: {
    updateOppression: (
      state,
      action: PayloadAction<{ value: number; growthRate: number; deltaTime: number }>
    ) => {
      const { value, growthRate } = action.payload;
      state.value = value;
      state.currentGrowthRate = growthRate;
      state.lastUpdated = Date.now();
    },
    
    addEventModifier: (
      state,
      action: PayloadAction<{ modifier: number; duration?: number }>
    ) => {
      const { modifier } = action.payload;
      state.eventModifiers.push(modifier);
    },
    
    removeEventModifier: (
      state,
      action: PayloadAction<{ index: number }>
    ) => {
      const { index } = action.payload;
      if (index >= 0 && index < state.eventModifiers.length) {
        state.eventModifiers.splice(index, 1);
      }
    },
    
    addPermanentResistance: (
      state,
      action: PayloadAction<{ value: number }>
    ) => {
      const { value } = action.payload;
      state.permanentResistance += value;
      // Cap permanent resistance at 75%
      state.permanentResistance = Math.min(0.75, state.permanentResistance);
    },
    
    resetOppression: (state) => {
      return {
        ...initialState,
        lastUpdated: Date.now()
      };
    }
  }
});

export const {
  updateOppression,
  addEventModifier,
  removeEventModifier,
  addPermanentResistance,
  resetOppression
} = oppressionSlice.actions;

export default oppressionSlice.reducer;
```

### Visual Representation of Oppression

#### Oppression Meter Component
```tsx
// src/components/oppression/OppressionMeter.tsx
import React, { useMemo } from 'react';
import { useAppSelector } from '../../state/hooks';
import './OppressionMeter.css';

const OppressionMeter: React.FC = () => {
  const oppression = useAppSelector(state => state.oppression);
  const collectivePower = useAppSelector(
    state => state.resources.byId['collective-power']?.amount || 0
  );
  
  // Calculate power balance as a percentage
  const powerBalance = useMemo(() => {
    const totalPower = oppression.value + collectivePower;
    if (totalPower === 0) return 50; // Neutral starting point
    
    // Calculate percentage of total that is collective power
    const collectivePowerPercentage = (collectivePower / totalPower) * 100;
    
    // Cap at 5-95% range for visual purposes
    return Math.min(95, Math.max(5, collectivePowerPercentage));
  }, [oppression.value, collectivePower]);
  
  // Determine status message
  const statusMessage = useMemo(() => {
    if (powerBalance > 80) return 'MOVEMENT THRIVING';
    if (powerBalance > 65) return 'GAINING GROUND';
    if (powerBalance > 45) return 'EVENLY MATCHED';
    if (powerBalance > 30) return 'UNDER PRESSURE';
    return 'DANGER - MOVEMENT AT RISK';
  }, [powerBalance]);
  
  // Determine color based on power balance
  const getStatusColor = () => {
    if (powerBalance > 80) return '#4caf50'; // Green
    if (powerBalance > 65) return '#8bc34a'; // Light green
    if (powerBalance > 45) return '#ffeb3b'; // Yellow
    if (powerBalance > 30) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };
  
  // Calculate growth rate in more readable form (% per hour)
  const hourlyGrowthRate = (oppression.currentGrowthRate * 60).toFixed(1);
  
  return (
    <div className="oppression-meter">
      <div className="oppression-header">
        <h3>Power Balance</h3>
        <div 
          className="status-indicator" 
          style={{ backgroundColor: getStatusColor() }}
        >
          {statusMessage}
        </div>
      </div>
      
      <div className="power-balance-meter">
        <div className="power-label movement-power">
          <span className="power-value">{Math.round(collectivePower)}</span>
          <span className="power-name">Movement Power</span>
        </div>
        
        <div className="balance-bar-container">
          <div 
            className="collective-power-bar" 
            style={{ width: `${powerBalance}%` }}
          />
          <div 
            className="oppression-bar" 
            style={{ width: `${100 - powerBalance}%` }}
          />
        </div>
        
        <div className="power-label oppression-power">
          <span className="power-value">{Math.round(oppression.value)}</span>
          <span className="power-name">Oppression</span>
        </div>
      </div>
      
      <div className="oppression-stats">
        <div className="stat-item">
          <span className="stat-label">Oppression Growth:</span>
          <span className="stat-value">{hourlyGrowthRate}% per hour</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resistance Level:</span>
          <span className="stat-value">
            {Math.round(oppression.permanentResistance * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default OppressionMeter;
```

#### CSS Styling
```css
/* src/components/oppression/OppressionMeter.css */
.oppression-meter {
  background-color: #222;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.oppression-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.oppression-header h3 {
  margin: 0;
  color: #fff;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #000;
}

.power-balance-meter {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.power-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.movement-power {
  color: #4caf50;
}

.oppression-power {
  color: #f44336;
}

.power-value {
  font-size: 18px;
  font-weight: bold;
}

.power-name {
  font-size: 12px;
  text-align: center;
}

.balance-bar-container {
  flex-grow: 1;
  height: 24px;
  background-color: #333;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 10px;
  display: flex;
}

.collective-power-bar {
  height: 100%;
  background: linear-gradient(90deg, #388e3c, #4caf50);
  transition: width 0.5s ease-out;
}

.oppression-bar {
  height: 100%;
  background: linear-gradient(90deg, #d32f2f, #f44336);
  transition: width 0.5s ease-out;
}

.oppression-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  margin-bottom: 2px;
}

.stat-value {
  font-weight: bold;
  color: #fff;
}
```

## Game Events and Interactions

### Oppression Events
```typescript
// src/data/events/oppressionEvents.ts
import { GameEvent } from '../../interfaces/events';

export const oppressionEvents: GameEvent[] = [
  {
    id: 'media-misrepresentation',
    title: 'Media Misrepresentation',
    description: 'Mainstream media has begun portraying your movement in a negative light, increasing public hostility.',
    type: 'OPPRESSION',
    effects: [
      {
        type: 'OPPRESSION_GROWTH',
        value: 0.03, // Temporary increase in oppression growth
        duration: 10 // Minutes
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'community-trust',
        value: -0.2, // Reduced generation
        duration: 15 // Minutes
      }
    ],
    choices: [
      {
        id: 'counter-narrative',
        label: 'Launch Counter-Narrative',
        description: 'Invest in alternative media to tell your side of the story',
        cost: {
          'collective-power': 20,
          'community-trust': 10
        },
        outcomes: [
          {
            type: 'OPPRESSION_GROWTH',
            value: -0.02,
            duration: 20
          },
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'community-trust',
            value: 0.1,
            duration: 30
          }
        ]
      },
      {
        id: 'direct-action',
        label: 'Focus on Direct Action',
        description: 'Ignore the media and focus on tangible achievements',
        cost: {
          'collective-power': 30
        },
        outcomes: [
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'collective-power',
            value: 0.2,
            duration: 15
          }
        ]
      }
    ],
    conditions: {
      minResource: {
        'collective-power': 50
      },
      maxOppression: 100,
      minGameTime: 20 // Minutes
    }
  },
  
  {
    id: 'corporate-influence',
    title: 'Corporate Influence Campaign',
    description: 'Large corporations have begun funding opposition to your movement, strengthening oppressive forces.',
    type: 'OPPRESSION',
    effects: [
      {
        type: 'OPPRESSION_VALUE',
        value: 15 // Direct increase to oppression value
      }
    ],
    choices: [
      {
        id: 'expose-corruption',
        label: 'Expose Corporate Corruption',
        description: 'Launch an investigation to reveal corporate misconduct',
        cost: {
          'collective-power': 40,
          'solidarity': 20
        },
        outcomes: [
          {
            type: 'OPPRESSION_VALUE',
            value: -25 // Reduces oppression directly
          },
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'community-trust',
            value: 0.3,
            duration: 30
          }
        ]
      },
      {
        id: 'boycott-campaign',
        label: 'Launch Boycott Campaign',
        description: 'Organize mass boycott of corporate sponsors',
        cost: {
          'collective-power': 30,
          'community-trust': 25
        },
        outcomes: [
          {
            type: 'OPPRESSION_GROWTH',
            value: -0.04,
            duration: 40
          }
        ]
      }
    ],
    conditions: {
      minResource: {
        'collective-power': 100,
        'solidarity': 20
      },
      minGameTime: 45 // Minutes
    }
  },
  
  {
    id: 'state-repression',
    title: 'State Repression',
    description: 'Government authorities have begun actively suppressing movement activities through regulatory means.',
    type: 'OPPRESSION',
    effects: [
      {
        type: 'OPPRESSION_GROWTH',
        value: 0.05,
        duration: 20
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'collective-power',
        value: -0.3,
        duration: 15
      }
    ],
    choices: [
      {
        id: 'legal-defense',
        label: 'Establish Legal Defense',
        description: 'Create a legal team to protect movement participants',
        cost: {
          'collective-power': 60,
          'community-trust': 30
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            value: 0.05 // Permanent resistance to oppression
          },
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'solidarity',
            value: 0.2,
            duration: 30
          }
        ]
      },
      {
        id: 'international-solidarity',
        label: 'Seek International Solidarity',
        description: 'Connect with international movements for support',
        cost: {
          'collective-power': 50,
          'solidarity': 40
        },
        outcomes: [
          {
            type: 'OPPRESSION_VALUE',
            value: -30
          },
          {
            type: 'RESOURCE_BOOST',
            resourceId: 'community-trust',
            value: 20
          }
        ]
      }
    ],
    conditions: {
      minResource: {
        'collective-power': 150
      },
      minOppression: 70,
      maxGameStage: 'LATE'
    }
  }
];
```

### Resistance Actions
```typescript
// src/data/actions/resistanceActions.ts
import { Action } from '../../interfaces/actions';

export const resistanceActions: Action[] = [
  {
    id: 'community-education',
    name: 'Community Education',
    description: 'Organize educational events to raise awareness and build resistance to oppression',
    cost: {
      'collective-power': 10
    },
    cooldown: 5, // Minutes
    effects: [
      {
        type: 'RESOURCE_BOOST',
        resourceId: 'community-trust',
        value: 5
      },
      {
        type: 'OPPRESSION_GROWTH',
        value: -0.01,
        duration: 10
      }
    ],
    requirements: {
      minResources: {
        'collective-power': 10
      },
      unlockedAt: 'EARLY'
    }
  },
  
  {
    id: 'direct-action',
    name: 'Direct Action Campaign',
    description: 'Organize coordinated direct actions to disrupt oppressive systems',
    cost: {
      'collective-power': 30,
      'solidarity': 15
    },
    cooldown: 15, // Minutes
    effects: [
      {
        type: 'OPPRESSION_VALUE',
        value: -10
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'collective-power',
        value: 0.2,
        duration: 20
      }
    ],
    requirements: {
      minResources: {
        'collective-power': 50,
        'solidarity': 15
      },
      unlockedAt: 'MID'
    }
  },
  
  {
    id: 'mutual-aid-network',
    name: 'Mutual Aid Network',
    description: 'Establish community support systems that operate outside oppressive structures',
    cost: {
      'collective-power': 50,
      'community-trust': 25,
      'solidarity': 20
    },
    cooldown: 30, // Minutes
    effects: [
      {
        type: 'PERMANENT_RESISTANCE',
        value: 0.03
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'solidarity',
        value: 0.15,
        duration: 60
      }
    ],
    requirements: {
      minResources: {
        'collective-power': 100,
        'community-trust': 25
      },
      unlockedAt: 'MID'
    }
  },
  
  {
    id: 'alternative-institutions',
    name: 'Build Alternative Institutions',
    description: 'Create lasting institutions that directly challenge existing power structures',
    cost: {
      'collective-power': 100,
      'community-trust': 50,
      'solidarity': 40
    },
    cooldown: 60, // Minutes
    effects: [
      {
        type: 'PERMANENT_RESISTANCE',
        value: 0.08
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'collective-power',
        value: 0.3,
        duration: 120
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'solidarity',
        value: 0.2,
        duration: 120
      }
    ],
    requirements: {
      minResources: {
        'collective-power': 200,
        'community-trust': 50,
        'solidarity': 40
      },
      unlockedAt: 'LATE'
    }
  }
];
```

## Game Over and Victory UI

### Game Over Component
```tsx
// src/components/GameOver.tsx
import React from 'react';
import { useAppSelector } from '../state/hooks';
import './GameOver.css';

interface GameOverProps {
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ onRestart }) => {
  const gameState = useAppSelector(state => state.game);
  const oppression = useAppSelector(state => state.oppression.value);
  const collectivePower = useAppSelector(
    state => state.resources.byId['collective-power']?.amount || 0
  );
  const completedMilestones = useAppSelector(state => 
    Object.values(state.progression.milestones).filter((m: any) => m.completed).length
  );
  
  // Get play time in hours and minutes
  const playTimeHours = Math.floor(gameState.totalPlayTime / (60 * 60 * 1000));
  const playTimeMinutes = Math.floor((gameState.totalPlayTime % (60 * 60 * 1000)) / (60 * 1000));
  
  return (
    <div className="game-over-overlay">
      <div className="game-over-container">
        <h1 className="game-over-title">Movement Suppressed</h1>
        
        <div className="game-over-message">
          <p>
            Your movement has been overwhelmed by systemic oppression.
            Despite your efforts, the powers that be have managed to suppress
            your organizing efforts.
          </p>
          <p>
            But remember: no movement truly dies. The seeds you've planted
            will sprout again when conditions are right.
          </p>
        </div>
        
        <div className="game-over-stats">
          <div className="stat-row">
            <span className="stat-label">Final Collective Power:</span>
            <span className="stat-value">{Math.round(collectivePower)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Final Oppression Level:</span>
            <span className="stat-value">{Math.round(oppression)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Milestones Achieved:</span>
            <span className="stat-value">{completedMilestones}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Movement Lifespan:</span>
            <span className="stat-value">
              {playTimeHours}h {playTimeMinutes}m
            </span>
          </div>
        </div>
        
        <div className="historical-quote">
          "Don't mourn, organize!" — Joe Hill
        </div>
        
        <button className="restart-button" onClick={onRestart}>
          Start New Movement
        </button>
      </div>
    </div>
  );
};

export default GameOver;
```

### Victory Component
```tsx
// src/components/Victory.tsx
import React from 'react';
import { useAppSelector } from '../state/hooks';
import './Victory.css';

interface VictoryProps {
  onContinue: () => void;
  onNewGame: () => void;
}

const Victory: React.FC<VictoryProps> = ({ onContinue, onNewGame }) => {
  const gameState = useAppSelector(state => state.game);
  const currentStage = useAppSelector(state => state.progression.currentStage);
  const finalStage = currentStage === 'END_GAME';
  const collectivePower = useAppSelector(
    state => state.resources.byId['collective-power']?.amount || 0
  );
  const completedMilestones = useAppSelector(state => 
    Object.values(state.progression.milestones).filter((m: any) => m.completed).length
  );
  
  // Get play time in hours and minutes
  const playTimeHours = Math.floor(gameState.totalPlayTime / (60 * 60 * 1000));
  const playTimeMinutes = Math.floor((gameState.totalPlayTime % (60 * 60 * 1000)) / (60 * 1000));
  
  return (
    <div className="victory-overlay">
      <div className="victory-container">
        <h1 className="victory-title">
          {finalStage ? 
            'A New World Emerges' : 
            'Movement Advances to New Stage!'}
        </h1>
        
        <div className="victory-message">
          {finalStage ? (
            <p>
              Your movement has successfully challenged capitalist hegemony and created 
              viable alternatives. Communities are now self-governing through direct 
              democratic structures, and the seeds of a new society have taken root.
            </p>
          ) : (
            <p>
              Your movement has successfully overcome oppressive forces and 
              advanced to a new stage of development. Your growing power has 
              forced systemic changes and opened new possibilities.
            </p>
          )}
        </div>
        
        <div className="victory-stats">
          <div className="stat-row">
            <span className="stat-label">Collective Power:</span>
            <span className="stat-value">{Math.round(collectivePower)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Milestones Achieved:</span>
            <span className="stat-value">{completedMilestones}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Movement Timeline:</span>
            <span className="stat-value">
              {playTimeHours}h {playTimeMinutes}m
            </span>
          </div>
        </div>
        
        <div className="historical-quote">
          {finalStage ?
            ""Another world is not only possible, she is on her way. On a quiet day, I can hear her breathing." — Arundhati Roy" :
            ""Never doubt that a small group of thoughtful, committed citizens can change the world. Indeed, it is the only thing that ever has." — Margaret Mead"}
        </div>
        
        <div className="victory-buttons">
          {!finalStage && (
            <button className="continue-button" onClick={onContinue}>
              Continue Building
            </button>
          )}
          <button className="new-game-button" onClick={onNewGame}>
            Start New Movement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Victory;
```

## Integration with Game Loop
```typescript
// src/core/GameLoop.ts

// Add to existing tick method
private tick(deltaTime: number): void {
  // Existing game loop code...
  
  // Update oppression
  OppressionSystem.getInstance().updateOppression(deltaTime);
  
  // Check game over condition
  const state = this.store.getState();
  if (state.game.gameOver) {
    this.stop();
    this.onGameOver?.();
  }
  
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

## Balance Considerations

### Initial Game Balance
- Start oppression at 5 (low enough to not feel overwhelming immediately)
- Start collective power generation at slight negative (-0.05/s)
- Initial collective power from clicking should exceed decay (+0.2 per click)
- First automation unlocks after reaching 0.2/s production rate
- Early game balance aims for ~10-15 minutes of active play before basic automation

### Oppression Scaling
- Base growth rate increases with game stages (early: 2%/min, late: 8%/min)
- Logarithmic scaling with playtime creates increasing pressure
- Solidarity and community trust provide resistance multipliers
- Completed milestones offer permanent resistance effects
- Special actions can temporarily reduce oppression

### Critical Balance Points
- Early game: Clicks > Decay + Oppression (player feels immediate agency)
- Mid game: Automation ~ Oppression Growth (balance between sources)
- Late game: Strategic Choices > Basic Automation (deeper decision-making)
- End game: Collective Organization > Individual Action (systemic change)