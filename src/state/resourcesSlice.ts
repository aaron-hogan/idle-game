import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource, UpgradeType } from '../models/resource';

type ResourcesState = Record<string, Resource>;

const initialState: ResourcesState = {};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    // Add a new resource
    addResource: (state, action: PayloadAction<Resource>) => {
      const resource = action.payload;
      
      // Initialize upgrades object if not provided
      if (!resource.upgrades) {
        resource.upgrades = {
          [UpgradeType.CLICK_POWER]: 0,
          [UpgradeType.PASSIVE_GENERATION]: 0,
        };
      }
      
      // Initialize basePerSecond if not provided
      if (resource.basePerSecond === undefined) {
        resource.basePerSecond = resource.perSecond;
      }
      
      state[resource.id] = resource;
    },
    
    // Update a resource's amount
    updateResourceAmount: (
      state, 
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      if (state[id]) {
        state[id].amount = Math.max(0, Math.min(amount, state[id].maxAmount));
      }
    },
    
    // Add to a resource's amount
    addResourceAmount: (
      state, 
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      if (state[id]) {
        const newAmount = state[id].amount + amount;
        state[id].amount = Math.max(0, Math.min(newAmount, state[id].maxAmount));
      }
    },
    
    // Update resource base generation rate
    updateBaseResourcePerSecond: (
      state,
      action: PayloadAction<{ id: string; basePerSecond: number }>
    ) => {
      const { id, basePerSecond } = action.payload;
      if (state[id]) {
        state[id].basePerSecond = basePerSecond;
        
        // Recalculate total perSecond by adding passive generation upgrades
        const upgradeLevel = state[id].upgrades?.[UpgradeType.PASSIVE_GENERATION] || 0;
        const upgradeBonus = upgradeLevel * 0.1; // Each upgrade adds 0.1
        state[id].perSecond = basePerSecond + upgradeBonus;
      }
    },
    
    // Update resource total generation rate
    updateResourcePerSecond: (
      state,
      action: PayloadAction<{ id: string; perSecond: number }>
    ) => {
      const { id, perSecond } = action.payload;
      if (state[id]) {
        state[id].perSecond = perSecond;
      }
    },
    
    // Toggle resource visibility
    toggleResourceUnlocked: (
      state,
      action: PayloadAction<{ id: string; unlocked: boolean }>
    ) => {
      const { id, unlocked } = action.payload;
      if (state[id]) {
        state[id].unlocked = unlocked;
      }
    },
    
    // Reset all resources
    resetResources: () => initialState,
    
    // Deduct resources (for purchases)
    deductResources: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      const costs = action.payload;
      for (const [resourceId, amount] of Object.entries(costs)) {
        if (state[resourceId]) {
          state[resourceId].amount = Math.max(0, state[resourceId].amount - amount);
        }
      }
    },
    
    // Update upgrade level for a resource
    updateUpgradeLevel: (
      state,
      action: PayloadAction<{ id: string; upgradeType: UpgradeType; level: number }>
    ) => {
      const { id, upgradeType, level } = action.payload;
      if (state[id]) {
        // Initialize upgrades object if it doesn't exist
        if (!state[id].upgrades) {
          state[id].upgrades = {};
        }
        
        // Update the upgrade level
        state[id].upgrades![upgradeType] = level;
        
        // Update derived value based on upgrade type
        if (upgradeType === UpgradeType.CLICK_POWER) {
          // Click power is 1 + level (level 0 = 1, level 1 = 2, etc.)
          state[id].clickPower = 1 + level;
        } else if (upgradeType === UpgradeType.PASSIVE_GENERATION) {
          // Update perSecond based on basePerSecond plus upgrades
          const baseRate = state[id].basePerSecond || 0;
          const upgradeBonus = level * 0.1; // Each level adds 0.1
          state[id].perSecond = baseRate + upgradeBonus;
        }
      }
    },
    
    // Update click power for a resource
    updateClickPower: (
      state,
      action: PayloadAction<{ id: string; clickPower: number }>
    ) => {
      const { id, clickPower } = action.payload;
      if (state[id]) {
        state[id].clickPower = clickPower;
        
        // Update the upgrade level based on click power
        if (!state[id].upgrades) {
          state[id].upgrades = {};
        }
        
        // Click power level is clickPower - 1 (level 0 = 1 power, level 1 = 2 power, etc.)
        state[id].upgrades![UpgradeType.CLICK_POWER] = clickPower - 1;
      }
    },
  },
});

// Add new actions for milestone rewards
const resourcesSliceActions = resourcesSlice.actions;

// New action to add to resource generation rate (for milestone rewards)
export const addResourcePerSecond = (
  state: ResourcesState,
  action: PayloadAction<{ id: string; perSecond: number }>
) => {
  const { id, perSecond } = action.payload;
  if (state[id]) {
    state[id].perSecond += perSecond;
  }
};

// New action to multiply resource generation rate (for milestone rewards)
export const multiplyResourcePerSecond = (
  state: ResourcesState,
  action: PayloadAction<{ id: string; multiplier: number }>
) => {
  const { id, multiplier } = action.payload;
  if (state[id]) {
    state[id].perSecond *= multiplier;
  }
};

// Add the new actions to the exported actions
resourcesSlice.actions.addResourcePerSecond = addResourcePerSecond;
resourcesSlice.actions.multiplyResourcePerSecond = multiplyResourcePerSecond;

export const {
  addResource,
  updateResourceAmount,
  addResourceAmount,
  updateResourcePerSecond,
  updateBaseResourcePerSecond,
  toggleResourceUnlocked,
  resetResources,
  deductResources,
  updateClickPower,
  updateUpgradeLevel,
  // New actions
  addResourcePerSecond,
  multiplyResourcePerSecond,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;