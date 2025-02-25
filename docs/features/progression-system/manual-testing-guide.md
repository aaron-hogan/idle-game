# Progression System Manual Testing Guide

This guide outlines how to manually test the Progression System in the Anti-Capitalist Idle Game. Since automated tests are facing integration issues, this manual testing approach ensures the functionality works as expected.

## Prerequisites

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Test Scenarios

### 1. System Initialization

**Objective**: Verify the progression system initializes correctly.

**Steps**:
1. Open the game in a browser
2. Open the browser console (F12 or Ctrl+Shift+I)
3. Check for initialization messages:
   ```
   Initializing progression system...
   Loading 17 milestones...
   Loading X achievements...
   Progression system initialized successfully.
   ```
4. Verify the UI shows the Progression Tracker with "Early Organizing" stage

**Expected Result**: Progression system initializes without errors, EARLY stage milestones are visible.

### 2. Milestone Visibility

**Objective**: Verify only appropriate milestones are visible based on game stage.

**Steps**:
1. Open the Progression Tracker
2. Check which milestones are visible
3. Note the visibility of future stage milestones

**Expected Result**: 
- Early game milestones (First Spark of Awareness, Community Outreach, etc.) should be visible
- Mid, Late, and End-Game milestones should be hidden or shown as locked

### 3. Milestone Completion

**Objective**: Verify milestones complete when requirements are met.

**Steps**:
1. Open the console and execute:
   ```javascript
   // Get progression manager instance
   const progManager = window.game.getProgressionManager();
   
   // Get store
   const store = window.game.getStore();
   
   // Add resource to meet a milestone requirement (e.g., 10 awareness)
   store.dispatch({
     type: 'resources/addResourceAmount',
     payload: { id: 'awareness', amount: 10 }
   });
   
   // Check milestone completion
   progManager.checkAllProgressionItems();
   ```
2. Check the UI for milestone completion indication

**Expected Result**: The "First Spark of Awareness" milestone should complete and show as completed in the UI.

### 4. Achievement Unlocking

**Objective**: Verify achievements unlock when requirements are met.

**Steps**:
1. Complete actions to meet an achievement's requirements
2. Check the Achievements section of the Progression Tracker
3. Verify unlocked achievements are displayed properly

**Expected Result**: Achievements unlock when requirements are met and display properly in the UI.

### 5. Stage Advancement

**Objective**: Verify advancing to a new game stage works correctly.

**Steps**:
1. Complete 5 early game milestones using the console commands:
   ```javascript
   // Complete each milestone (replace with actual IDs)
   const milestones = ['first-awareness', 'community-outreach', 'resource-sharing', 'study-circle', 'first-protest'];
   const progManager = window.game.getProgressionManager();
   
   milestones.forEach(id => progManager.completeMilestone(id));
   
   // Check stage advancement
   progManager.checkStageAdvancement();
   ```
2. Verify stage advancement in UI

**Expected Result**: Game advances to MID stage, and mid-game milestones become visible.

### 6. Feature Unlocking

**Objective**: Verify completed milestones unlock features as expected.

**Steps**:
1. Complete a milestone that unlocks a feature (e.g., "First Spark of Awareness" unlocks "basic-resources")
2. Check if the feature is accessible:
   ```javascript
   const progManager = window.game.getProgressionManager();
   console.log(progManager.shouldFeatureBeUnlocked('basic-resources'));
   ```

**Expected Result**: Feature unlocking check returns true, and the feature becomes accessible in the game.

### 7. Progress Calculation

**Objective**: Verify progress percentage calculations work correctly.

**Steps**:
1. Complete several milestones and unlock achievements
2. Check progress percentages:
   ```javascript
   const progManager = window.game.getProgressionManager();
   console.log('Stage completion:', progManager.getCurrentStageCompletionPercentage());
   console.log('Overall completion:', progManager.getOverallCompletionPercentage());
   ```

**Expected Result**: Progress percentages reflect the proportion of completed milestones and unlocked achievements.

## Test Reporting

After completing the manual tests, document your findings:

1. Which features are working correctly?
2. Are there any edge cases or unexpected behaviors?
3. Are there visual issues with the progression UI components?
4. Do milestones complete and rewards apply correctly?
5. Does stage advancement work properly?

## Troubleshooting Common Issues

### UI Not Updating After Milestone Completion

If the UI doesn't update after a milestone completes:
1. Check console for errors
2. Verify the Redux state has updated:
   ```javascript
   console.log(window.game.getStore().getState().progression);
   ```
3. Try triggering a UI refresh by changing tabs or reopening the Progression Tracker

### Stage Not Advancing

If completing milestones doesn't advance the game stage:
1. Verify the number of completed milestones meets the requirement (5 for MID stage)
2. Check if the milestones are properly marked as completed in the state
3. Manually trigger stage advancement check:
   ```javascript
   window.game.getProgressionManager().checkStageAdvancement();
   ```

### Features Not Unlocking

If features don't unlock after milestone completion:
1. Confirm the milestone has the correct unlocks array in its definition
2. Check if the feature implementation is looking for the correct feature ID
3. Verify the shouldFeatureBeUnlocked method returns the expected result