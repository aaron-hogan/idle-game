import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Structure } from '../models/structure';

type StructuresState = Record<string, Structure>;

const initialState: StructuresState = {};

const structuresSlice = createSlice({
  name: 'structures',
  initialState,
  reducers: {
    // Add a new structure
    addStructure: (state, action: PayloadAction<Structure>) => {
      const structure = action.payload;
      state[structure.id] = structure;
    },
    
    // Update structure level
    upgradeStructure: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state[id] && state[id].level < state[id].maxLevel) {
        state[id].level += 1;
        // Note: Cost scaling would be applied elsewhere
      }
    },
    
    // Assign workers to a structure
    assignWorkers: (
      state, 
      action: PayloadAction<{ id: string; workers: number; track?: boolean }>
    ) => {
      const { id, workers } = action.payload;
      if (state[id]) {
        state[id].workers = Math.max(0, Math.min(workers, state[id].maxWorkers));
      }
      // Note: track flag is processed by middleware, not in reducer
    },
    
    // Change worker count by a delta amount
    changeWorkerCount: (
      state,
      action: PayloadAction<{ id: string; delta: number; track?: boolean }>
    ) => {
      const { id, delta } = action.payload;
      if (state[id]) {
        const newWorkers = state[id].workers + delta;
        state[id].workers = Math.max(0, Math.min(newWorkers, state[id].maxWorkers));
      }
      // Note: track flag is processed by middleware, not in reducer
    },
    
    // Toggle structure visibility
    toggleStructureUnlocked: (
      state,
      action: PayloadAction<{ id: string; unlocked: boolean }>
    ) => {
      const { id, unlocked } = action.payload;
      if (state[id]) {
        state[id].unlocked = unlocked;
      }
    },
    
    // Update production values for a structure
    updateProduction: (
      state,
      action: PayloadAction<{ 
        id: string; 
        production: Record<string, number> 
      }>
    ) => {
      const { id, production } = action.payload;
      if (state[id]) {
        state[id].production = { ...production };
      }
    },
    
    // Reset all structures
    resetStructures: () => initialState,
  },
});

export const {
  addStructure,
  upgradeStructure,
  assignWorkers,
  changeWorkerCount,
  toggleStructureUnlocked,
  updateProduction,
  resetStructures,
} = structuresSlice.actions;

export default structuresSlice.reducer;