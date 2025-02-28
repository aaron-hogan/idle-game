import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TutorialState, TutorialStep } from '../types/tutorial';

const initialState: TutorialState = {
  active: false,
  currentStep: null,
  completedTutorials: [],
  tutorialsEnabled: true,
  firstTimeUser: true,
  showContextualHelp: true,
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    setActiveTutorial: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<TutorialStep | null>) => {
      state.currentStep = action.payload;
    },
    completeTutorial: (state, action: PayloadAction<TutorialStep>) => {
      const tutorialId = action.payload;
      if (!state.completedTutorials.includes(tutorialId)) {
        state.completedTutorials.push(tutorialId);
      }
    },
    setTutorialsEnabled: (state, action: PayloadAction<boolean>) => {
      state.tutorialsEnabled = action.payload;
    },
    setFirstTimeUser: (state, action: PayloadAction<boolean>) => {
      state.firstTimeUser = action.payload;
    },
    setShowContextualHelp: (state, action: PayloadAction<boolean>) => {
      state.showContextualHelp = action.payload;
    },
    resetTutorials: (state) => {
      state.completedTutorials = [];
      state.firstTimeUser = true;
      state.currentStep = null;
      state.active = false;
    },
  },
});

export const {
  setActiveTutorial,
  setCurrentStep,
  completeTutorial,
  setTutorialsEnabled,
  setFirstTimeUser,
  setShowContextualHelp,
  resetTutorials,
} = tutorialSlice.actions;

export default tutorialSlice.reducer;
