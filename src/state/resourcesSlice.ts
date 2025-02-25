import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from '../models/resource';

type ResourcesState = Record<string, Resource>;

const initialState: ResourcesState = {};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    // Add a new resource
    addResource: (state, action: PayloadAction<Resource>) => {
      const resource = action.payload;
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
    
    // Update resource generation rate
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
    
    // Update click power for a resource
    updateClickPower: (
      state,
      action: PayloadAction<{ id: string; clickPower: number }>
    ) => {
      const { id, clickPower } = action.payload;
      if (state[id]) {
        state[id].clickPower = clickPower;
      }
    },
  },
});

export const {
  addResource,
  updateResourceAmount,
  addResourceAmount,
  updateResourcePerSecond,
  toggleResourceUnlocked,
  resetResources,
  deductResources,
  updateClickPower,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;