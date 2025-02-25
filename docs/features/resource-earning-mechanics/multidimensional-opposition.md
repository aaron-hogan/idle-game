# Multidimensional Opposition System

## Concept Overview
The game's opposition system is expanded to include multiple dimensions that players must strategically counter, creating a more nuanced and realistic representation of social movement challenges. These opposing forces work together but require different strategies to overcome.

## Core Dimensions

### 1. Oppression vs. Resistance
- **Oppression**: Direct force applied by state and corporate power
- **Resistance**: Collective physical and legal opposition to power structures
- **Manifestation**: Police, laws, regulations, physical barriers
- **Primary Counter-Resource**: Collective Power

### 2. Division vs. Solidarity
- **Division**: Attempts to fragment the movement through identity politics and infighting
- **Solidarity**: Unity across diverse communities and interests
- **Manifestation**: Media manipulation, targeted messaging, wedge issues
- **Primary Counter-Resource**: Solidarity

### 3. Apathy vs. Consciousness
- **Apathy**: Public indifference and learned helplessness
- **Consciousness**: Awareness of systemic issues and alternatives
- **Manifestation**: Entertainment distractions, consumerism, cynicism
- **Primary Counter-Resource**: Community Trust

### 4. Recuperation vs. Autonomy
- **Recuperation**: Assimilation of movement elements into capitalist structures
- **Autonomy**: Self-determination and independence from dominant systems
- **Manifestation**: Co-option, greenwashing, false solutions, careerists
- **Primary Counter-Resource**: Material Independence

## Implementation Design

### Opposition Force Model
```typescript
// src/interfaces/opposition.ts
export enum OppositionType {
  OPPRESSION = 'oppression',
  DIVISION = 'division',
  APATHY = 'apathy',
  RECUPERATION = 'recuperation'
}

export interface OppositionForce {
  type: OppositionType;
  value: number;
  baseGrowthRate: number;
  currentGrowthRate: number;
  eventModifiers: number[];
  permanentResistance: number;
  description: string;
  threshold: {
    defeat: number;  // Value relative to counter-resource that triggers defeat
    victory: number; // Value relative to counter-resource that enables progress
  };
  counterResource: string;
}

export interface OppositionState {
  forces: Record<OppositionType, OppositionForce>;
  lastUpdated: number;
  currentDominant: OppositionType | null;
  defeatCondition: boolean;
  victoryProgress: number;
}
```

### Redux Implementation
```typescript
// src/state/oppositionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OppositionState, OppositionType, OppositionForce } from '../interfaces/opposition';

const initialOppositionForces: Record<OppositionType, OppositionForce> = {
  [OppositionType.OPPRESSION]: {
    type: OppositionType.OPPRESSION,
    value: 5,
    baseGrowthRate: 0.02,
    currentGrowthRate: 0.02,
    eventModifiers: [],
    permanentResistance: 0,
    description: 'Direct force applied by state and corporate power',
    threshold: {
      defeat: 1.5, // Oppression > 1.5 * Collective Power = defeat
      victory: 0.5, // Oppression < 0.5 * Collective Power = progress
    },
    counterResource: 'collective-power'
  },
  [OppositionType.DIVISION]: {
    type: OppositionType.DIVISION,
    value: 10,
    baseGrowthRate: 0.015,
    currentGrowthRate: 0.015,
    eventModifiers: [],
    permanentResistance: 0,
    description: 'Attempts to fragment the movement through identity politics and infighting',
    threshold: {
      defeat: 2.0, // Division > 2.0 * Solidarity = defeat
      victory: 0.6, // Division < 0.6 * Solidarity = progress
    },
    counterResource: 'solidarity'
  },
  [OppositionType.APATHY]: {
    type: OppositionType.APATHY,
    value: 20,
    baseGrowthRate: 0.01,
    currentGrowthRate: 0.01,
    eventModifiers: [],
    permanentResistance: 0,
    description: 'Public indifference and learned helplessness',
    threshold: {
      defeat: 2.5, // Apathy > 2.5 * Community Trust = defeat
      victory: 0.7, // Apathy < 0.7 * Community Trust = progress
    },
    counterResource: 'community-trust'
  },
  [OppositionType.RECUPERATION]: {
    type: OppositionType.RECUPERATION,
    value: 0, // Starts at 0, only appears in mid-game
    baseGrowthRate: 0.025,
    currentGrowthRate: 0.025,
    eventModifiers: [],
    permanentResistance: 0,
    description: 'Assimilation of movement elements into capitalist structures',
    threshold: {
      defeat: 1.8, // Recuperation > 1.8 * Material Independence = defeat
      victory: 0.5, // Recuperation < 0.5 * Material Independence = progress
    },
    counterResource: 'material-independence'
  }
};

const initialState: OppositionState = {
  forces: initialOppositionForces,
  lastUpdated: Date.now(),
  currentDominant: null,
  defeatCondition: false,
  victoryProgress: 0
};

const oppositionSlice = createSlice({
  name: 'opposition',
  initialState,
  reducers: {
    updateOppositionForce: (
      state,
      action: PayloadAction<{
        type: OppositionType;
        value: number;
        growthRate: number;
      }>
    ) => {
      const { type, value, growthRate } = action.payload;
      if (state.forces[type]) {
        state.forces[type].value = value;
        state.forces[type].currentGrowthRate = growthRate;
      }
      state.lastUpdated = Date.now();
    },
    
    addOppositionEventModifier: (
      state,
      action: PayloadAction<{
        type: OppositionType;
        modifier: number;
      }>
    ) => {
      const { type, modifier } = action.payload;
      if (state.forces[type]) {
        state.forces[type].eventModifiers.push(modifier);
      }
    },
    
    removeOppositionEventModifier: (
      state,
      action: PayloadAction<{
        type: OppositionType;
        index: number;
      }>
    ) => {
      const { type, index } = action.payload;
      if (state.forces[type] && 
          index >= 0 && 
          index < state.forces[type].eventModifiers.length) {
        state.forces[type].eventModifiers.splice(index, 1);
      }
    },
    
    addPermanentResistance: (
      state,
      action: PayloadAction<{
        type: OppositionType;
        value: number;
      }>
    ) => {
      const { type, value } = action.payload;
      if (state.forces[type]) {
        state.forces[type].permanentResistance += value;
        // Cap permanent resistance at 85%
        state.forces[type].permanentResistance = Math.min(0.85, state.forces[type].permanentResistance);
      }
    },
    
    setCurrentDominant: (
      state,
      action: PayloadAction<{
        type: OppositionType | null;
      }>
    ) => {
      state.currentDominant = action.payload.type;
    },
    
    setDefeatCondition: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.defeatCondition = action.payload;
    },
    
    updateVictoryProgress: (
      state,
      action: PayloadAction<number>
    ) => {
      state.victoryProgress = action.payload;
    },
    
    resetOpposition: (state) => {
      return {
        ...initialState,
        lastUpdated: Date.now()
      };
    }
  }
});

export const {
  updateOppositionForce,
  addOppositionEventModifier,
  removeOppositionEventModifier,
  addPermanentResistance,
  setCurrentDominant,
  setDefeatCondition,
  updateVictoryProgress,
  resetOpposition
} = oppositionSlice.actions;

export default oppositionSlice.reducer;
```

### Opposition System Implementation
```typescript
// src/systems/OppositionSystem.ts
import { store } from '../state/store';
import { 
  updateOppositionForce, 
  setCurrentDominant,
  setDefeatCondition,
  updateVictoryProgress
} from '../state/oppositionSlice';
import { OppositionType } from '../interfaces/opposition';
import { GameStage } from '../interfaces/progression';

export class OppositionSystem {
  private static instance: OppositionSystem | null = null;
  
  // Growth rate multipliers per stage
  private readonly STAGE_MULTIPLIERS: Record<GameStage, number> = {
    [GameStage.EARLY]: 1.0,
    [GameStage.MID]: 1.5,
    [GameStage.LATE]: 2.0,
    [GameStage.END_GAME]: 2.5
  };
  
  // Which forces are active in which stages
  private readonly ACTIVE_FORCES: Record<GameStage, OppositionType[]> = {
    [GameStage.EARLY]: [
      OppositionType.OPPRESSION, 
      OppositionType.DIVISION
    ],
    [GameStage.MID]: [
      OppositionType.OPPRESSION, 
      OppositionType.DIVISION, 
      OppositionType.APATHY
    ],
    [GameStage.LATE]: [
      OppositionType.OPPRESSION, 
      OppositionType.DIVISION, 
      OppositionType.APATHY, 
      OppositionType.RECUPERATION
    ],
    [GameStage.END_GAME]: [
      OppositionType.OPPRESSION, 
      OppositionType.DIVISION, 
      OppositionType.APATHY, 
      OppositionType.RECUPERATION
    ]
  };
  
  private constructor() {}
  
  public static getInstance(): OppositionSystem {
    if (!OppositionSystem.instance) {
      OppositionSystem.instance = new OppositionSystem();
    }
    return OppositionSystem.instance;
  }
  
  public updateOpposition(deltaTime: number): void {
    const state = store.getState();
    const currentStage = state.progression.currentStage;
    const stageMultiplier = this.STAGE_MULTIPLIERS[currentStage] || 1.0;
    const activeForces = this.ACTIVE_FORCES[currentStage] || [OppositionType.OPPRESSION];
    
    // Update each active opposition force
    activeForces.forEach(forceType => {
      this.updateOppositionForce(forceType, deltaTime, stageMultiplier);
    });
    
    // Determine dominant opposition force
    this.updateDominantForce();
    
    // Check victory and defeat conditions
    this.checkVictoryAndDefeatConditions();
  }
  
  private updateOppositionForce(
    forceType: OppositionType, 
    deltaTime: number, 
    stageMultiplier: number
  ): void {
    const state = store.getState();
    const force = state.opposition.forces[forceType];
    
    if (!force) return;
    
    // Calculate time factor (logarithmic growth over time)
    const gameTime = state.game.totalPlayTime / 60000; // in minutes
    const timeFactor = Math.log10(Math.max(10, gameTime)) * 0.15;
    
    // Calculate resistance modifier
    const resistanceModifier = this.calculateResistanceModifier(forceType);
    
    // Calculate event modifiers
    const eventModifier = force.eventModifiers.reduce((total, mod) => total + mod, 0);
    
    // Calculate adjusted growth rate
    const adjustedBaseRate = force.baseGrowthRate * stageMultiplier;
    const growthRate = adjustedBaseRate * 
                      (1 + timeFactor) * 
                      (1 - resistanceModifier) + 
                      eventModifier;
    
    // Calculate growth (per minute, adjusted for deltaTime)
    const growth = force.value * growthRate * (deltaTime / 60000);
    const newValue = force.value + growth;
    
    // Update the force
    store.dispatch(updateOppositionForce({
      type: forceType,
      value: newValue,
      growthRate
    }));
  }
  
  private calculateResistanceModifier(forceType: OppositionType): number {
    const state = store.getState();
    const force = state.opposition.forces[forceType];
    
    if (!force) return 0;
    
    // Base resistance from permanent upgrades
    let resistanceModifier = force.permanentResistance;
    
    // Add resistance from counter-resource
    const counterResourceId = force.counterResource;
    const counterResource = state.resources.byId[counterResourceId];
    
    if (counterResource) {
      // More resources = more resistance
      // Log scale to prevent easy dominance
      const resourceFactor = Math.log10(Math.max(10, counterResource.amount)) * 0.05;
      resistanceModifier += resourceFactor;
    }
    
    // Add cross-resistance effects (each force is partially affected by other resources)
    switch (forceType) {
      case OppositionType.OPPRESSION:
        // Solidarity helps against oppression somewhat
        const solidarity = state.resources.byId['solidarity']?.amount || 0;
        resistanceModifier += Math.log10(Math.max(10, solidarity)) * 0.02;
        break;
        
      case OppositionType.DIVISION:
        // Community trust helps against division
        const communityTrust = state.resources.byId['community-trust']?.amount || 0;
        resistanceModifier += Math.log10(Math.max(10, communityTrust)) * 0.03;
        break;
        
      case OppositionType.APATHY:
        // Collective power helps against apathy
        const collectivePower = state.resources.byId['collective-power']?.amount || 0;
        resistanceModifier += Math.log10(Math.max(10, collectivePower)) * 0.02;
        break;
        
      case OppositionType.RECUPERATION:
        // All resources help somewhat against recuperation
        const totalResources = Object.values(state.resources.byId)
          .reduce((sum, resource) => sum + resource.amount, 0);
        resistanceModifier += Math.log10(Math.max(10, totalResources)) * 0.01;
        break;
    }
    
    // Cap resistance at 90% to prevent complete immunity
    return Math.min(0.9, resistanceModifier);
  }
  
  private updateDominantForce(): void {
    const state = store.getState();
    const activeForces = this.ACTIVE_FORCES[state.progression.currentStage] || 
                         [OppositionType.OPPRESSION];
    
    let dominantForce: OppositionType | null = null;
    let highestThreatRatio = 0;
    
    // Calculate threat ratio for each force
    activeForces.forEach(forceType => {
      const force = state.opposition.forces[forceType];
      if (!force) return;
      
      const counterResource = state.resources.byId[force.counterResource];
      if (!counterResource) return;
      
      // Calculate how close this force is to defeat threshold
      const threatRatio = force.value / (counterResource.amount * force.threshold.defeat);
      
      if (threatRatio > highestThreatRatio) {
        highestThreatRatio = threatRatio;
        dominantForce = forceType;
      }
    });
    
    // Update dominant force
    if (dominantForce !== state.opposition.currentDominant) {
      store.dispatch(setCurrentDominant({ type: dominantForce }));
    }
  }
  
  private checkVictoryAndDefeatConditions(): void {
    const state = store.getState();
    const activeForces = this.ACTIVE_FORCES[state.progression.currentStage] || 
                         [OppositionType.OPPRESSION];
    
    // Check for defeat condition - any force exceeds its defeat threshold
    let defeatCondition = false;
    let defeatForce: OppositionType | null = null;
    
    for (const forceType of activeForces) {
      const force = state.opposition.forces[forceType];
      if (!force) continue;
      
      const counterResource = state.resources.byId[force.counterResource];
      if (!counterResource) continue;
      
      // Check if this force exceeds its defeat threshold
      if (force.value > counterResource.amount * force.threshold.defeat) {
        defeatCondition = true;
        defeatForce = forceType;
        break;
      }
    }
    
    // Update defeat condition
    if (defeatCondition !== state.opposition.defeatCondition) {
      store.dispatch(setDefeatCondition(defeatCondition));
      
      // If newly defeated, trigger game over
      if (defeatCondition) {
        store.dispatch({
          type: 'game/setGameOver',
          payload: {
            reason: `OPPOSITION_OVERWHELMING_${defeatForce}`,
            message: `The movement has been overcome by ${defeatForce}.`,
            timestamp: Date.now()
          }
        });
      }
    }
    
    // Check for victory progress - how many forces are below their victory threshold
    let victoriesCount = 0;
    let totalActiveForces = activeForces.length;
    
    for (const forceType of activeForces) {
      const force = state.opposition.forces[forceType];
      if (!force) continue;
      
      const counterResource = state.resources.byId[force.counterResource];
      if (!counterResource) continue;
      
      // Check if this force is below its victory threshold
      if (force.value < counterResource.amount * force.threshold.victory) {
        victoriesCount++;
      }
    }
    
    // Calculate victory progress as a percentage
    const victoryProgress = totalActiveForces > 0 ? 
                           (victoriesCount / totalActiveForces) * 100 : 0;
    
    // Update victory progress
    if (victoryProgress !== state.opposition.victoryProgress) {
      store.dispatch(updateVictoryProgress(victoryProgress));
      
      // If all forces are below victory threshold, trigger stage advancement
      if (victoriesCount === totalActiveForces && totalActiveForces > 0) {
        this.tryAdvanceGameStage();
      }
    }
  }
  
  private tryAdvanceGameStage(): void {
    const state = store.getState();
    const currentStage = state.progression.currentStage;
    
    // Don't advance if already at end game
    if (currentStage === GameStage.END_GAME) return;
    
    // Determine next stage
    let nextStage: GameStage;
    switch (currentStage) {
      case GameStage.EARLY:
        nextStage = GameStage.MID;
        break;
      case GameStage.MID:
        nextStage = GameStage.LATE;
        break;
      case GameStage.LATE:
        nextStage = GameStage.END_GAME;
        break;
      default:
        return; // Unknown stage, can't advance
    }
    
    // Advance to next stage
    store.dispatch({
      type: 'progression/advanceGameStage',
      payload: {
        stage: nextStage,
        reachedAt: Date.now()
      }
    });
    
    // Apply stage transition effects
    this.applyStageTransitionEffects(nextStage);
  }
  
  private applyStageTransitionEffects(newStage: GameStage): void {
    const state = store.getState();
    
    // Reduce all opposition forces temporarily
    const reduction = {
      [GameStage.MID]: 0.3,      // 30% reduction
      [GameStage.LATE]: 0.4,     // 40% reduction
      [GameStage.END_GAME]: 0.5  // 50% reduction
    }[newStage] || 0.3;
    
    // Apply reduction to all active forces
    const activeForces = this.ACTIVE_FORCES[state.progression.currentStage] || 
                         [OppositionType.OPPRESSION];
    
    activeForces.forEach(forceType => {
      const force = state.opposition.forces[forceType];
      if (!force) return;
      
      const newValue = force.value * (1 - reduction);
      
      store.dispatch(updateOppositionForce({
        type: forceType,
        value: newValue,
        growthRate: force.currentGrowthRate
      }));
    });
    
    // Add transition event
    store.dispatch({
      type: 'events/addEvent',
      payload: {
        id: `stage-transition-${Date.now()}`,
        title: `Movement Reaches New Stage: ${this.getStageName(newStage)}`,
        description: `Your movement has overcome systemic opposition and reached a new stage of development! Opposition forces have been temporarily weakened by ${reduction * 100}%.`,
        timestamp: Date.now(),
        type: 'MILESTONE',
        effects: [
          {
            type: 'OPPOSITION_REDUCTION',
            value: reduction
          }
        ],
        read: false
      }
    });
    
    // If this is mid-game, introduce new forces
    if (newStage === GameStage.MID) {
      // Introduce apathy
      const apathyForce = state.opposition.forces[OppositionType.APATHY];
      if (apathyForce) {
        // Ensure community trust resource is unlocked
        store.dispatch({
          type: 'resources/toggleResourceUnlocked',
          payload: {
            id: 'community-trust',
            unlocked: true
          }
        });
        
        // Add event for new opposition force
        store.dispatch({
          type: 'events/addEvent',
          payload: {
            id: `new-force-apathy-${Date.now()}`,
            title: 'New Challenge: Public Apathy',
            description: 'As your movement grows, a new challenge emerges: public apathy and indifference. Build community trust to overcome this opposition.',
            timestamp: Date.now(),
            type: 'OPPOSITION',
            effects: [],
            read: false
          }
        });
      }
    }
    
    // If this is late-game, introduce recuperation
    if (newStage === GameStage.LATE) {
      // Introduce recuperation
      const recuperationForce = state.opposition.forces[OppositionType.RECUPERATION];
      if (recuperationForce) {
        // Ensure material independence resource is unlocked
        store.dispatch({
          type: 'resources/toggleResourceUnlocked',
          payload: {
            id: 'material-independence',
            unlocked: true
          }
        });
        
        // Add event for new opposition force
        store.dispatch({
          type: 'events/addEvent',
          payload: {
            id: `new-force-recuperation-${Date.now()}`,
            title: 'New Challenge: Recuperation',
            description: 'Your movement has grown large enough that the system is trying to co-opt and absorb it. Build material independence to resist being assimilated into capitalism.',
            timestamp: Date.now(),
            type: 'OPPOSITION',
            effects: [],
            read: false
          }
        });
      }
    }
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

## User Interface Design

### Opposition Forces Dashboard
```tsx
// src/components/opposition/OppositionDashboard.tsx
import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { OppositionType } from '../../interfaces/opposition';
import OppositionForceCard from './OppositionForceCard';
import './OppositionDashboard.css';

const OppositionDashboard: React.FC = () => {
  const opposition = useAppSelector(state => state.opposition);
  const progression = useAppSelector(state => state.progression);
  const activeForces = getActiveForces(progression.currentStage);
  
  // Calculate overall victory progress
  const victoryProgress = opposition.victoryProgress;
  
  return (
    <div className="opposition-dashboard">
      <div className="dashboard-header">
        <h3>Systemic Opposition</h3>
        <div className="victory-progress">
          <div className="progress-label">Movement Progress:</div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.min(100, victoryProgress)}%` }}
            />
            <span className="progress-text">{Math.floor(victoryProgress)}%</span>
          </div>
        </div>
      </div>
      
      <div className="forces-container">
        {activeForces.map(forceType => (
          <OppositionForceCard 
            key={forceType} 
            forceType={forceType}
            isDominant={opposition.currentDominant === forceType}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to get active forces based on game stage
function getActiveForces(stage: string): OppositionType[] {
  switch (stage) {
    case 'early':
      return [OppositionType.OPPRESSION, OppositionType.DIVISION];
    case 'mid':
      return [OppositionType.OPPRESSION, OppositionType.DIVISION, OppositionType.APATHY];
    case 'late':
    case 'endGame':
      return [
        OppositionType.OPPRESSION, 
        OppositionType.DIVISION, 
        OppositionType.APATHY, 
        OppositionType.RECUPERATION
      ];
    default:
      return [OppositionType.OPPRESSION];
  }
}

export default OppositionDashboard;
```

### Individual Force Card Component
```tsx
// src/components/opposition/OppositionForceCard.tsx
import React, { useMemo } from 'react';
import { useAppSelector } from '../../state/hooks';
import { OppositionType } from '../../interfaces/opposition';
import './OppositionForceCard.css';

interface OppositionForceCardProps {
  forceType: OppositionType;
  isDominant: boolean;
}

const OppositionForceCard: React.FC<OppositionForceCardProps> = ({ 
  forceType, 
  isDominant 
}) => {
  const force = useAppSelector(state => state.opposition.forces[forceType]);
  const resources = useAppSelector(state => state.resources.byId);
  
  if (!force) return null;
  
  // Get counter resource
  const counterResource = resources[force.counterResource];
  
  // Calculate power balance
  const powerBalance = useMemo(() => {
    if (!counterResource || counterResource.amount === 0) return 0;
    
    const totalPower = force.value + counterResource.amount;
    if (totalPower === 0) return 50; // Equal balance
    
    // Calculate percentage of total that is counter resource
    return (counterResource.amount / totalPower) * 100;
  }, [force.value, counterResource?.amount]);
  
  // Calculate defeat/victory thresholds
  const defeatRatio = counterResource ? 
                    force.value / (counterResource.amount * force.threshold.defeat) : 
                    1;
  
  const victoryRatio = counterResource ? 
                     force.value / (counterResource.amount * force.threshold.victory) : 
                     1;
  
  // Determine status
  const getStatus = () => {
    if (defeatRatio >= 0.9) return 'CRITICAL';
    if (defeatRatio >= 0.7) return 'DANGER';
    if (defeatRatio >= 0.5) return 'WARNING';
    if (victoryRatio <= 1) return 'ADVANCING';
    return 'STABLE';
  };
  
  // Get color based on status
  const getStatusColor = () => {
    const status = getStatus();
    switch (status) {
      case 'CRITICAL': return '#d32f2f';
      case 'DANGER': return '#f44336';
      case 'WARNING': return '#ff9800';
      case 'STABLE': return '#ffeb3b';
      case 'ADVANCING': return '#4caf50';
      default: return '#ffeb3b';
    }
  };
  
  // Get icon for force type
  const getIcon = () => {
    switch (forceType) {
      case OppositionType.OPPRESSION: return '👊';
      case OppositionType.DIVISION: return '⚔️';
      case OppositionType.APATHY: return '😴';
      case OppositionType.RECUPERATION: return '🔄';
      default: return '❓';
    }
  };
  
  // Get name for force type
  const getName = () => {
    switch (forceType) {
      case OppositionType.OPPRESSION: return 'Oppression';
      case OppositionType.DIVISION: return 'Division';
      case OppositionType.APATHY: return 'Apathy';
      case OppositionType.RECUPERATION: return 'Recuperation';
      default: return 'Unknown';
    }
  };
  
  // Get counter resource name
  const getCounterName = () => {
    switch (force.counterResource) {
      case 'collective-power': return 'Collective Power';
      case 'solidarity': return 'Solidarity';
      case 'community-trust': return 'Community Trust';
      case 'material-independence': return 'Material Independence';
      default: return force.counterResource;
    }
  };
  
  // Calculate hourly growth rate
  const hourlyGrowthRate = (force.currentGrowthRate * 60).toFixed(1);
  
  return (
    <div className={`opposition-force-card ${isDominant ? 'dominant' : ''}`}>
      <div className="force-header">
        <div className="force-icon">{getIcon()}</div>
        <div className="force-name">{getName()}</div>
        <div 
          className="force-status"
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatus()}
        </div>
      </div>
      
      <div className="force-description">{force.description}</div>
      
      <div className="power-balance">
        <div className="balance-labels">
          <div className="counter-label">{getCounterName()}</div>
          <div className="opposition-label">{getName()}</div>
        </div>
        
        <div className="balance-bar-container">
          <div 
            className="counter-bar" 
            style={{ width: `${Math.min(100, powerBalance)}%` }}
          />
          <div 
            className="opposition-bar" 
            style={{ width: `${Math.min(100, 100 - powerBalance)}%` }}
          />
        </div>
        
        <div className="balance-values">
          <div className="counter-value">
            {counterResource ? Math.round(counterResource.amount) : 0}
          </div>
          <div className="opposition-value">
            {Math.round(force.value)}
          </div>
        </div>
      </div>
      
      <div className="force-stats">
        <div className="stat-item">
          <div className="stat-label">Growth Rate:</div>
          <div className="stat-value">{hourlyGrowthRate}% / hour</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Resistance:</div>
          <div className="stat-value">
            {Math.round(force.permanentResistance * 100)}%
          </div>
        </div>
      </div>
      
      <div className="threshold-indicators">
        <div className="threshold victory">
          <span className="threshold-label">Victory</span>
          <span className="threshold-value">
            {counterResource ? 
             Math.round(counterResource.amount * force.threshold.victory) : 0}
          </span>
        </div>
        <div className="threshold defeat">
          <span className="threshold-label">Defeat</span>
          <span className="threshold-value">
            {counterResource ? 
             Math.round(counterResource.amount * force.threshold.defeat) : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OppositionForceCard;
```

### CSS for Opposition Dashboard
```css
/* src/components/opposition/OppositionDashboard.css */
.opposition-dashboard {
  background-color: #1e1e2e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h3 {
  margin: 0;
  color: #fff;
  font-size: 20px;
}

.victory-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-label {
  color: #ccc;
  font-size: 14px;
}

.progress-container {
  width: 200px;
  height: 12px;
  background-color: #333;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #388e3c, #4caf50);
  transition: width 0.5s ease-out;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
}

.forces-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* For smaller screens */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .victory-progress {
    width: 100%;
  }
  
  .progress-container {
    flex-grow: 1;
  }
  
  .forces-container {
    grid-template-columns: 1fr;
  }
}
```

### CSS for Opposition Force Card
```css
/* src/components/opposition/OppositionForceCard.css */
.opposition-force-card {
  background-color: #2a2a3a;
  border-radius: 6px;
  padding: 16px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.opposition-force-card.dominant {
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
  transform: scale(1.02);
}

.force-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.force-icon {
  font-size: 24px;
  margin-right: 8px;
}

.force-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  flex-grow: 1;
}

.force-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #000;
}

.force-description {
  color: #bbb;
  font-size: 14px;
  margin-bottom: 15px;
  height: 40px;
  overflow: hidden;
}

.power-balance {
  margin-bottom: 15px;
}

.balance-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.counter-label {
  color: #4caf50;
  font-size: 12px;
}

.opposition-label {
  color: #f44336;
  font-size: 12px;
}

.balance-bar-container {
  height: 16px;
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  margin-bottom: 4px;
}

.counter-bar {
  height: 100%;
  background: linear-gradient(90deg, #388e3c, #4caf50);
  transition: width 0.5s ease-out;
}

.opposition-bar {
  height: 100%;
  background: linear-gradient(90deg, #d32f2f, #f44336);
  transition: width 0.5s ease-out;
}

.balance-values {
  display: flex;
  justify-content: space-between;
}

.counter-value {
  color: #4caf50;
  font-weight: bold;
  font-size: 14px;
}

.opposition-value {
  color: #f44336;
  font-weight: bold;
  font-size: 14px;
}

.force-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #aaa;
  font-size: 12px;
}

.stat-value {
  color: #fff;
  font-weight: bold;
  font-size: 14px;
}

.threshold-indicators {
  display: flex;
  justify-content: space-between;
}

.threshold {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.threshold.victory {
  background-color: rgba(76, 175, 80, 0.2);
}

.threshold.defeat {
  background-color: rgba(244, 67, 54, 0.2);
}

.threshold-label {
  color: #ccc;
  margin-bottom: 2px;
}

.threshold-value {
  font-weight: bold;
}

.threshold.victory .threshold-value {
  color: #4caf50;
}

.threshold.defeat .threshold-value {
  color: #f44336;
}
```

## Thematic Characteristics of Each Opposition Force

### 1. Oppression (vs. Collective Power)
- **Character**: Blunt force, authoritarian control, hierarchical
- **Manifestations**: Police/military repression, legal restrictions, physical barriers
- **Mechanics**: Most direct threat, fast growth in early game
- **Countering Strategy**: Building collective power through direct action and organizing
- **Key Events**: Police raids, regulatory crackdowns, legal challenges

### 2. Division (vs. Solidarity)
- **Character**: Fragmenting, divisive, exploits differences
- **Manifestations**: Identity politics manipulation, media distortion, provocation
- **Mechanics**: Creates multipliers that reduce effectiveness of actions
- **Countering Strategy**: Building solidarity across differences, intersectional organizing
- **Key Events**: Media smear campaigns, infiltration attempts, political wedge issues

### 3. Apathy (vs. Community Trust)
- **Character**: Draining, disheartening, obscuring alternatives
- **Manifestations**: Consumer distractions, cynicism, learned helplessness
- **Mechanics**: Slows resource generation rates, appears in mid-game
- **Countering Strategy**: Building community trust through education and shared experience
- **Key Events**: Media disinformation, cynical narrative promotion, hyper-consumption events

### 4. Recuperation (vs. Material Independence)
- **Character**: Co-optive, assimilating, compromising
- **Manifestations**: Corporate co-option, careerists, false solutions
- **Mechanics**: Redirects a percentage of resources, appears in late-game
- **Countering Strategy**: Building material independence through alternative institutions
- **Key Events**: Foundation funding offers, corporate partnerships, career advancement opportunities

## Sample Events for Each Opposition Force

### Oppression Events
```typescript
// src/data/events/oppressionEvents.ts
export const oppressionEvents = [
  {
    id: 'police-surveillance',
    title: 'Increased Police Surveillance',
    description: 'Law enforcement has stepped up surveillance of movement activities.',
    type: 'OPPRESSION',
    effects: [
      {
        type: 'OPPOSITION_GROWTH',
        oppositionType: OppositionType.OPPRESSION,
        value: 0.02,
        duration: 20
      }
    ],
    choices: [
      {
        id: 'security-culture',
        label: 'Develop Security Culture',
        description: 'Train movement participants in secure communications and practice',
        cost: {
          'collective-power': 25,
          'solidarity': 10
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.OPPRESSION,
            value: 0.05
          }
        ]
      },
      {
        id: 'public-exposure',
        label: 'Publicly Expose Surveillance',
        description: 'Document and publicize surveillance tactics to generate backlash',
        cost: {
          'collective-power': 15,
          'community-trust': 20
        },
        outcomes: [
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.OPPRESSION,
            value: -15
          },
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.APATHY,
            value: -10
          }
        ]
      }
    ]
  },
  
  {
    id: 'activist-arrests',
    title: 'Key Activists Arrested',
    description: 'Several movement organizers have been arrested on dubious charges.',
    type: 'OPPRESSION',
    effects: [
      {
        type: 'OPPOSITION_VALUE',
        oppositionType: OppositionType.OPPRESSION,
        value: 20
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'collective-power',
        value: -0.2,
        duration: 10
      }
    ],
    choices: [
      {
        id: 'legal-defense',
        label: 'Organize Legal Defense',
        description: 'Mobilize resources for legal support and courtroom solidarity',
        cost: {
          'collective-power': 40,
          'community-trust': 15
        },
        outcomes: [
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.OPPRESSION,
            value: -25
          },
          {
            type: 'RESOURCE_BOOST',
            resourceId: 'solidarity',
            value: 15
          }
        ]
      },
      {
        id: 'escalate-response',
        label: 'Escalate Movement Response',
        description: 'Organize larger demonstrations against the arrests',
        cost: {
          'collective-power': 30,
          'solidarity': 25
        },
        outcomes: [
          {
            type: 'RESOURCE_BOOST',
            resourceId: 'collective-power',
            value: 25
          },
          {
            type: 'OPPOSITION_GROWTH',
            oppositionType: OppositionType.OPPRESSION,
            value: 0.01,
            duration: 15
          }
        ]
      }
    ]
  }
];
```

### Division Events
```typescript
// src/data/events/divisionEvents.ts
export const divisionEvents = [
  {
    id: 'media-wedge-issues',
    title: 'Media Promotes Wedge Issues',
    description: 'Mainstream media is highlighting differences within the movement to create internal conflict.',
    type: 'DIVISION',
    effects: [
      {
        type: 'OPPOSITION_GROWTH',
        oppositionType: OppositionType.DIVISION,
        value: 0.025,
        duration: 15
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'solidarity',
        value: -0.15,
        duration: 10
      }
    ],
    choices: [
      {
        id: 'intersectional-organizing',
        label: 'Intersectional Organizing',
        description: 'Build stronger connections across different identity groups',
        cost: {
          'collective-power': 20,
          'community-trust': 15
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.DIVISION,
            value: 0.06
          },
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'solidarity',
            value: 0.1,
            duration: 30
          }
        ]
      },
      {
        id: 'focus-on-commonality',
        label: 'Focus on Common Ground',
        description: 'Emphasize issues that unite different groups within the movement',
        cost: {
          'collective-power': 15,
          'solidarity': 10
        },
        outcomes: [
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.DIVISION,
            value: -20
          }
        ]
      }
    ]
  },
  
  {
    id: 'infiltrator-discovered',
    title: 'Infiltrator Discovered',
    description: 'An agent provocateur has been attempting to create internal conflicts.',
    type: 'DIVISION',
    effects: [
      {
        type: 'OPPOSITION_VALUE',
        oppositionType: OppositionType.DIVISION,
        value: 15
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'solidarity',
        value: -0.2,
        duration: 5
      }
    ],
    choices: [
      {
        id: 'accountability-process',
        label: 'Transparent Accountability Process',
        description: 'Address the issue openly with clear accountability',
        cost: {
          'collective-power': 10,
          'community-trust': 20
        },
        outcomes: [
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.DIVISION,
            value: -25
          },
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.DIVISION,
            value: 0.04
          }
        ]
      },
      {
        id: 'security-protocols',
        label: 'Implement Security Protocols',
        description: 'Create better vetting and security measures',
        cost: {
          'collective-power': 25,
          'solidarity': 10
        },
        outcomes: [
          {
            type: 'OPPOSITION_GROWTH',
            oppositionType: OppositionType.DIVISION,
            value: -0.02,
            duration: 30
          }
        ]
      }
    ]
  }
];
```

### Apathy Events
```typescript
// src/data/events/apathyEvents.ts
export const apathyEvents = [
  {
    id: 'consumer-distraction',
    title: 'Major Consumer Distraction',
    description: 'A major product release is dominating public attention, making organizing difficult.',
    type: 'APATHY',
    effects: [
      {
        type: 'OPPOSITION_GROWTH',
        oppositionType: OppositionType.APATHY,
        value: 0.03,
        duration: 10
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'community-trust',
        value: -0.1,
        duration: 15
      }
    ],
    choices: [
      {
        id: 'alternative-celebration',
        label: 'Organize Alternative Celebration',
        description: 'Create a free, community-focused event as an alternative',
        cost: {
          'collective-power': 30,
          'community-trust': 15
        },
        outcomes: [
          {
            type: 'RESOURCE_BOOST',
            resourceId: 'community-trust',
            value: 25
          },
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.APATHY,
            value: -20
          }
        ]
      },
      {
        id: 'critical-analysis',
        label: 'Produce Critical Analysis',
        description: 'Create accessible content analyzing consumer culture',
        cost: {
          'collective-power': 15,
          'solidarity': 10
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.APATHY,
            value: 0.05
          }
        ]
      }
    ]
  },
  
  {
    id: 'public-cynicism',
    title: 'Wave of Public Cynicism',
    description: 'A wave of "nothing will change" sentiment is spreading through the community.',
    type: 'APATHY',
    effects: [
      {
        type: 'OPPOSITION_VALUE',
        oppositionType: OppositionType.APATHY,
        value: 25
      },
      {
        type: 'RESOURCE_GENERATION',
        resourceId: 'collective-power',
        value: -0.15,
        duration: 20
      }
    ],
    choices: [
      {
        id: 'showcase-victories',
        label: 'Showcase Movement Victories',
        description: 'Highlight concrete achievements and positive changes',
        cost: {
          'collective-power': 20,
          'community-trust': 15
        },
        outcomes: [
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.APATHY,
            value: -30
          }
        ]
      },
      {
        id: 'practical-workshops',
        label: 'Organize Practical Workshops',
        description: 'Hold workshops teaching tangible skills for community change',
        cost: {
          'collective-power': 25,
          'solidarity': 15
        },
        outcomes: [
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'community-trust',
            value: 0.2,
            duration: 30
          },
          {
            type: 'OPPOSITION_GROWTH',
            oppositionType: OppositionType.APATHY,
            value: -0.015,
            duration: 40
          }
        ]
      }
    ]
  }
];
```

### Recuperation Events
```typescript
// src/data/events/recuperationEvents.ts
export const recuperationEvents = [
  {
    id: 'corporate-sponsorship',
    title: 'Corporate Sponsorship Offer',
    description: 'A major corporation has offered significant funding for your movement activities.',
    type: 'RECUPERATION',
    effects: [
      {
        type: 'OPPOSITION_GROWTH',
        oppositionType: OppositionType.RECUPERATION,
        value: 0.02,
        duration: 0 // Immediate effect, depends on choice
      }
    ],
    choices: [
      {
        id: 'reject-funding',
        label: 'Reject Corporate Funding',
        description: 'Maintain independence by refusing the offer',
        cost: {
          'collective-power': 0 // No direct cost
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.RECUPERATION,
            value: 0.08
          },
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'material-independence',
            value: 0.1,
            duration: 30
          }
        ]
      },
      {
        id: 'accept-with-conditions',
        label: 'Accept with Strict Conditions',
        description: 'Take the money but maintain strict control over messaging',
        cost: {
          'collective-power': 10,
          'solidarity': 15
        },
        outcomes: [
          {
            type: 'RESOURCE_BOOST',
            resourceId: 'collective-power',
            value: 50
          },
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.RECUPERATION,
            value: 30
          }
        ]
      }
    ]
  },
  
  {
    id: 'movement-commodification',
    title: 'Movement Being Commodified',
    description: 'Companies are selling merchandise with movement slogans and imagery.',
    type: 'RECUPERATION',
    effects: [
      {
        type: 'OPPOSITION_VALUE',
        oppositionType: OppositionType.RECUPERATION,
        value: 20
      },
      {
        type: 'OPPOSITION_GROWTH',
        oppositionType: OppositionType.APATHY,
        value: 0.01,
        duration: 20
      }
    ],
    choices: [
      {
        id: 'create-alternatives',
        label: 'Create Movement Alternatives',
        description: 'Produce movement-owned merchandise with authentic messaging',
        cost: {
          'collective-power': 35,
          'material-independence': 25
        },
        outcomes: [
          {
            type: 'RESOURCE_GENERATION',
            resourceId: 'material-independence',
            value: 0.2,
            duration: 40
          },
          {
            type: 'OPPOSITION_VALUE',
            oppositionType: OppositionType.RECUPERATION,
            value: -15
          }
        ]
      },
      {
        id: 'critique-commodification',
        label: 'Launch Critique Campaign',
        description: 'Create pointed critique of co-option and commodification',
        cost: {
          'collective-power': 20,
          'community-trust': 15
        },
        outcomes: [
          {
            type: 'PERMANENT_RESISTANCE',
            oppositionType: OppositionType.RECUPERATION,
            value: 0.06
          },
          {
            type: 'OPPOSITION_GROWTH',
            oppositionType: OppositionType.RECUPERATION,
            value: -0.02,
            duration: 25
          }
        ]
      }
    ]
  }
];
```

## Integration with Game Loop

```typescript
// src/core/GameLoop.ts

// Add to existing tick method
private tick(deltaTime: number): void {
  // Existing game loop code...
  
  // Update opposition forces
  OppositionSystem.getInstance().updateOpposition(deltaTime);
  
  // Check game over condition
  const state = this.store.getState();
  if (state.opposition.defeatCondition) {
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

## Game Balance Considerations

### 1. Early Game (0-15 minutes)
- Focus on Oppression and Division as primary challenges
- Clicking provides collective power to counter oppression
- Initial solidarity unlocks after reaching first milestone
- Limited options for countering division initially
- Strategic choices begin to emerge around minute 10

### 2. Mid Game (15-45 minutes)
- Apathy emerges as a third dimension of opposition
- Community trust becomes important counter-resource
- More complex resource conversion chains
- Strategic choices between short-term gains and long-term resistance
- Events become more frequent and consequential

### 3. Late Game (45+ minutes)
- All four opposition dimensions active
- Recuperation poses sophisticated challenges
- Material independence becomes critical
- Complex interplay between opposition forces
- Critical strategic choices with permanent consequences
- Path to systemic transformation emerges

### Balance Targets
- First opposition defeat encounter: ~8-10 minutes (recoverable)
- First "close call" with dominant opposition: ~12-15 minutes
- Introduction of each new opposition force: strategically paced
- Victory stage transition timing: 15-20 minutes per stage
- Final victory condition: ~60-90 minutes

## Sample Player Journey

### Early Phase (0-15 minutes)
1. Player starts clicking collective power resource
2. Oppression starts growing slowly
3. First milestone requires 0.2/s production rate
4. Basic automation unlocks, reducing clicking burden
5. Division opposition becomes noticeable
6. First oppression event creates strategic choice
7. Solidarity resource unlocks to counter division
8. Player balances resource generation vs. resistance

### Middle Phase (15-45 minutes)
1. Player advances to mid-game stage
2. Apathy emerges as new opposition force
3. Community trust becomes important
4. Multiple events require strategic balancing
5. Resource conversion chains become more complex
6. Player must choose which opposition force to prioritize
7. Permanent resistance upgrades become available
8. Resources begin synergizing in interesting ways

### Late Phase (45+ minutes)
1. Player advances to late-game stage
2. Recuperation emerges as final opposition force
3. Material independence unlocks to counter recuperation
4. Complex interplay between all four opposition dimensions
5. Critical choices with permanent consequences
6. Final victory conditions become clear
7. Player navigates toward systemic transformation
8. End-game challenge requires all systems working together

This multidimensional approach creates a sophisticated strategic experience that models the complex challenges faced by real social movements, while keeping gameplay engaging and thematically coherent.