import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import {
  GameStage,
  Milestone,
  Achievement,
  ProgressionState,
  MilestoneType,
  AchievementType,
} from '../interfaces/progression';

// Initial state with empty collections and EARLY game stage
const initialState: ProgressionState = {
  currentStage: GameStage.EARLY,
  milestones: {},
  achievements: {},
  milestoneIds: [],
  achievementIds: [],
  milestonesByStage: {
    [GameStage.EARLY]: [],
    [GameStage.MID]: [],
    [GameStage.LATE]: [],
    [GameStage.END_GAME]: [],
  },
  milestonesByType: {
    [MilestoneType.RESOURCE]: [],
    [MilestoneType.ORGANIZATION]: [],
    [MilestoneType.MOVEMENT]: [],
    [MilestoneType.AWARENESS]: [],
    [MilestoneType.RESISTANCE]: [],
    [MilestoneType.TRANSFORMATION]: [],
    [MilestoneType.SPECIAL]: [],
  },
  achievementsByType: {
    [AchievementType.RESOURCE]: [],
    [AchievementType.STRATEGIC]: [],
    [AchievementType.ETHICAL]: [],
    [AchievementType.COMMUNITY]: [],
    [AchievementType.RESISTANCE]: [],
    [AchievementType.TIMED]: [],
    [AchievementType.SPECIAL]: [],
  },
  stageReachedAt: {
    [GameStage.EARLY]: null,
    [GameStage.MID]: null,
    [GameStage.LATE]: null,
    [GameStage.END_GAME]: null,
  },
};

const progressionSlice = createSlice({
  name: 'progression',
  initialState,
  reducers: {
    // Add a new milestone
    addMilestone: (state, action: PayloadAction<Milestone>) => {
      const milestone = action.payload;

      // Add to lookups
      state.milestones[milestone.id] = milestone;

      // Add to ID list if not already present
      if (!state.milestoneIds.includes(milestone.id)) {
        state.milestoneIds.push(milestone.id);
      }

      // Add to stage lists
      if (milestone.stage) {
        if (!state.milestonesByStage[milestone.stage]) {
          state.milestonesByStage[milestone.stage] = [];
        }

        if (!state.milestonesByStage[milestone.stage]?.includes(milestone.id)) {
          state.milestonesByStage[milestone.stage]?.push(milestone.id);
        }
      }

      // Add to type lists
      if (milestone.type) {
        if (!state.milestonesByType[milestone.type]) {
          state.milestonesByType[milestone.type] = [];
        }

        if (!state.milestonesByType[milestone.type]?.includes(milestone.id)) {
          state.milestonesByType[milestone.type]?.push(milestone.id);
        }
      }
    },

    // Add a new achievement
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = action.payload;

      // Add to lookups
      state.achievements[achievement.id] = achievement;

      // Add to ID list if not already present
      if (!state.achievementIds.includes(achievement.id)) {
        state.achievementIds.push(achievement.id);
      }

      // Add to type lists
      if (achievement.type) {
        if (!state.achievementsByType[achievement.type]) {
          state.achievementsByType[achievement.type] = [];
        }

        if (!state.achievementsByType[achievement.type]?.includes(achievement.id)) {
          state.achievementsByType[achievement.type]?.push(achievement.id);
        }
      }
    },

    // Complete a milestone
    completeMilestone: (state, action: PayloadAction<{ id: string; completedAt: number }>) => {
      const { id, completedAt } = action.payload;

      if (state.milestones[id]) {
        state.milestones[id].completed = true;
        state.milestones[id].completedAt = completedAt;
      }
    },

    // Unlock an achievement
    unlockAchievement: (state, action: PayloadAction<{ id: string; unlockedAt: number }>) => {
      const { id, unlockedAt } = action.payload;

      if (state.achievements[id]) {
        state.achievements[id].unlocked = true;
        state.achievements[id].unlockedAt = unlockedAt;
      }
    },

    // Advance to a new game stage
    advanceGameStage: (state, action: PayloadAction<{ stage: GameStage; reachedAt: number }>) => {
      const { stage, reachedAt } = action.payload;

      // Only allow advancing to a later stage
      const stageValues = {
        [GameStage.EARLY]: 1,
        [GameStage.MID]: 2,
        [GameStage.LATE]: 3,
        [GameStage.END_GAME]: 4,
      };

      if (stageValues[stage] > stageValues[state.currentStage]) {
        state.currentStage = stage;
        state.stageReachedAt[stage] = reachedAt;
      }
    },

    // Update milestone visibility
    setMilestoneVisibility: (state, action: PayloadAction<{ id: string; visible: boolean }>) => {
      const { id, visible } = action.payload;

      if (state.milestones[id]) {
        state.milestones[id].visible = visible;
      }
    },

    // Reset progression (used for testing or new game)
    resetProgression: () => initialState,
  },
});

// Export actions
export const {
  addMilestone,
  addAchievement,
  completeMilestone,
  unlockAchievement,
  advanceGameStage,
  setMilestoneVisibility,
  resetProgression,
} = progressionSlice.actions;

// Basic selectors
export const selectCurrentStage = (state: { progression: ProgressionState }) =>
  state.progression.currentStage;

export const selectMilestoneById = (state: { progression: ProgressionState }, id: string) =>
  state.progression.milestones[id];

export const selectAchievementById = (state: { progression: ProgressionState }, id: string) =>
  state.progression.achievements[id];

// Memoized selectors for lists
const selectMilestoneIds = (state: { progression: ProgressionState }) =>
  state.progression.milestoneIds;
const selectMilestones = (state: { progression: ProgressionState }) => state.progression.milestones;
const selectAchievementIds = (state: { progression: ProgressionState }) =>
  state.progression.achievementIds;
const selectAchievements = (state: { progression: ProgressionState }) =>
  state.progression.achievements;

// Create properly memoized versions of these selectors
export const selectAllMilestones = createSelector(
  [selectMilestoneIds, selectMilestones],
  (ids, milestones) => ids.map((id) => milestones[id])
);

export const selectAllAchievements = createSelector(
  [selectAchievementIds, selectAchievements],
  (ids, achievements) => ids.map((id) => achievements[id])
);

// Derived selectors
export const selectCompletedMilestones = createSelector(selectAllMilestones, (milestones) =>
  milestones.filter((milestone) => milestone.completed)
);

export const selectUnlockedAchievements = createSelector(selectAllAchievements, (achievements) =>
  achievements.filter((achievement) => achievement.unlocked)
);

export const selectVisibleMilestones = createSelector(selectAllMilestones, (milestones) =>
  milestones.filter((milestone) => milestone.visible)
);

export const selectVisibleAchievements = createSelector(selectAllAchievements, (achievements) =>
  achievements.filter((achievement) => !achievement.hidden || achievement.unlocked)
);

// Memoized selectors for stages and types
export const selectStageMilestones = createSelector(
  [
    (state: { progression: ProgressionState }) => state.progression.milestonesByStage,
    (state: { progression: ProgressionState }) => state.progression.milestones,
    (state: { progression: ProgressionState }, stage: GameStage) => stage,
  ],
  (milestonesByStage, milestones, stage) => {
    const milestoneIds = milestonesByStage[stage] || [];
    return milestoneIds.map((id) => milestones[id]);
  }
);

export const selectTypeMilestones = createSelector(
  [
    (state: { progression: ProgressionState }) => state.progression.milestonesByType,
    (state: { progression: ProgressionState }) => state.progression.milestones,
    (state: { progression: ProgressionState }, type: MilestoneType) => type,
  ],
  (milestonesByType, milestones, type) => {
    const milestoneIds = milestonesByType[type] || [];
    return milestoneIds.map((id) => milestones[id]);
  }
);

export const selectTypeAchievements = createSelector(
  [
    (state: { progression: ProgressionState }) => state.progression.achievementsByType,
    (state: { progression: ProgressionState }) => state.progression.achievements,
    (state: { progression: ProgressionState }, type: AchievementType) => type,
  ],
  (achievementsByType, achievements, type) => {
    const achievementIds = achievementsByType[type] || [];
    return achievementIds.map((id) => achievements[id]);
  }
);

// Fix the current stage milestones selector to use createSelector properly
export const selectStageByCurrentStage = createSelector(
  [
    selectCurrentStage,
    (state: { progression: ProgressionState }) => state.progression.milestonesByStage,
    selectMilestones,
  ],
  (currentStage, milestonesByStage, milestones) => {
    const milestoneIds = milestonesByStage[currentStage] || [];
    return milestoneIds.map((id) => milestones[id]);
  }
);

export const selectCompletionPercentage = createSelector(
  [selectAllMilestones, selectAllAchievements],
  (milestones, achievements) => {
    const totalItems = milestones.length + achievements.length;
    if (totalItems === 0) return 0;

    const completedMilestones = milestones.filter((m) => m.completed).length;
    const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

    return Math.round(((completedMilestones + unlockedAchievements) / totalItems) * 100);
  }
);

export default progressionSlice.reducer;
