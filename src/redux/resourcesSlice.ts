import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource, ResourceCategory } from '../interfaces/Resource';

// Define the state type using the Resource interface
interface ResourcesState {
  byId: Record<string, Resource>;
  allIds: string[];
  categories: {
    [key in ResourceCategory]?: string[];
  };
}

// Initial state with properly categorized resources
const initialState: ResourcesState = {
  byId: {},
  allIds: [],
  categories: {
    [ResourceCategory.PRIMARY]: [],
    [ResourceCategory.SECONDARY]: [],
    [ResourceCategory.ADVANCED]: [],
    [ResourceCategory.SPECIAL]: [],
    [ResourceCategory.THREAT]: []
  }
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    // Add a new resource
    addResource: (state, action: PayloadAction<Resource>) => {
      const resource = action.payload;
      
      // Add to byId lookup
      state.byId[resource.id] = resource;
      
      // Add to allIds if not already present
      if (!state.allIds.includes(resource.id)) {
        state.allIds.push(resource.id);
      }
      
      // Add to category lists if appropriate
      if (resource.category) {
        if (!state.categories[resource.category]) {
          state.categories[resource.category] = [];
        }
        
        if (!state.categories[resource.category]?.includes(resource.id)) {
          state.categories[resource.category]?.push(resource.id);
        }
      }
    },
    
    // Update resource amount
    updateResourceAmount: (
      state, 
      action: PayloadAction<{ id: string; amount: number; allowNegative?: boolean }>
    ) => {
      const { id, amount, allowNegative = false } = action.payload;
      
      if (state.byId[id]) {
        // Update with bounds checking
        state.byId[id].amount = allowNegative 
          ? amount 
          : Math.max(0, Math.min(amount, state.byId[id].maxAmount));
      }
    },
    
    // Add to resource amount
    addResourceAmount: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      
      if (state.byId[id]) {
        const resource = state.byId[id];
        const newAmount = resource.amount + amount;
        resource.amount = Math.max(0, Math.min(newAmount, resource.maxAmount));
      }
    },
    
    // Set resource generation rate
    setResourcePerSecond: (
      state,
      action: PayloadAction<{ id: string; perSecond: number }>
    ) => {
      const { id, perSecond } = action.payload;
      
      if (state.byId[id]) {
        state.byId[id].perSecond = perSecond;
      }
    },
    
    // Toggle resource visibility
    toggleResourceUnlocked: (
      state,
      action: PayloadAction<{ id: string; unlocked: boolean }>
    ) => {
      const { id, unlocked } = action.payload;
      
      if (state.byId[id]) {
        state.byId[id].unlocked = unlocked;
        
        // If newly unlocked, make sure it's in the appropriate category list
        if (unlocked && state.byId[id].category) {
          const category = state.byId[id].category;
          if (!state.categories[category]?.includes(id)) {
            state.categories[category]?.push(id);
          }
        }
      }
    },
    
    // Update max amount for a resource
    updateMaxAmount: (
      state,
      action: PayloadAction<{ id: string; maxAmount: number }>
    ) => {
      const { id, maxAmount } = action.payload;
      
      if (state.byId[id]) {
        state.byId[id].maxAmount = maxAmount;
        
        // Cap current amount if it exceeds new max
        if (state.byId[id].amount > maxAmount) {
          state.byId[id].amount = maxAmount;
        }
      }
    },
    
    // Update resource category
    updateResourceCategory: (
      state,
      action: PayloadAction<{ id: string; category: ResourceCategory }>
    ) => {
      const { id, category } = action.payload;
      
      if (state.byId[id]) {
        // Remove from old category first
        const oldCategory = state.byId[id].category;
        if (oldCategory && state.categories[oldCategory]) {
          state.categories[oldCategory] = state.categories[oldCategory]?.filter(
            resourceId => resourceId !== id
          );
        }
        
        // Set new category
        state.byId[id].category = category;
        
        // Add to new category list
        if (!state.categories[category]) {
          state.categories[category] = [];
        }
        
        if (!state.categories[category]?.includes(id)) {
          state.categories[category]?.push(id);
        }
      }
    },
    
    // Reset all resources
    resetResources: () => initialState,
    
    // Update click power for a resource
    updateClickPower: (
      state,
      action: PayloadAction<{ id: string; clickPower: number }>
    ) => {
      const { id, clickPower } = action.payload;
      
      if (state.byId[id]) {
        state.byId[id].clickPower = clickPower;
      }
    },
  },
});

// Export actions
export const {
  addResource,
  updateResourceAmount,
  addResourceAmount,
  setResourcePerSecond,
  toggleResourceUnlocked,
  updateMaxAmount,
  updateResourceCategory,
  updateClickPower,
  resetResources
} = resourcesSlice.actions;

// Export selectors
export const selectAllResources = (state: { resources: ResourcesState }) => 
  state.resources.byId;

export const selectResourceIds = (state: { resources: ResourcesState }) => 
  state.resources.allIds;

export const selectResourceById = (state: { resources: ResourcesState }, id: string) => 
  state.resources.byId[id];

export const selectResourcesByCategory = (
  state: { resources: ResourcesState }, 
  category: ResourceCategory
) => {
  const ids = state.resources.categories[category] || [];
  return ids.map(id => state.resources.byId[id]);
};

export const selectUnlockedResources = (state: { resources: ResourcesState }) => {
  return state.resources.allIds
    .filter(id => state.resources.byId[id].unlocked)
    .map(id => state.resources.byId[id]);
};

export default resourcesSlice.reducer;