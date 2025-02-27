/**
 * ProgressionManager is responsible for tracking player progression through the game
 * and managing milestones and achievements
 */
import { 
  GameStage, 
  Milestone, 
  Achievement, 
  StageRequirement,
  AchievementReward,
  MilestoneType,
  AchievementType
} from '../../interfaces/progression';
import { store } from '../../state/store';
import { 
  completeMilestone, 
  unlockAchievement, 
  advanceGameStage,
  selectMilestoneById,
  selectAchievementById,
  selectCurrentStage,
  selectCompletedMilestones,
  selectUnlockedAchievements,
  selectVisibleMilestones,
  selectVisibleAchievements,
  selectStageByCurrentStage
} from '../../redux/progressionSlice';
import { getCurrentTime } from '../../utils/timeUtils';
import { updateResourcePerSecond } from '../../state/resourcesSlice';

// Type safety for resources
// Removing problematic type declaration that was causing build errors

/**
 * Manager for the game's progression system
 */
export class ProgressionManager {
  private static instance: ProgressionManager | null = null;
  public debuggingEnabled: boolean = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.debugLog('ProgressionManager initialized');
  }

  /**
   * Get the singleton instance of ProgressionManager
   */
  public static getInstance(): ProgressionManager {
    if (!ProgressionManager.instance) {
      ProgressionManager.instance = new ProgressionManager();
    }
    return ProgressionManager.instance;
  }

  /**
   * Check if requirements for a milestone or achievement are met
   * @param requirements The requirements to check
   * @returns True if all requirements are met, false otherwise
   */
  public checkRequirements(requirements: StageRequirement[]): boolean {
    try {
      if (!requirements || requirements.length === 0) {
        this.debugLog('Warning: No requirements provided to check');
        return false;
      }

      // Check each requirement
      for (const requirement of requirements) {
        const isRequirementMet = this.evaluateRequirement(requirement);
        if (!isRequirementMet) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking requirements:', error);
      return false;
    }
  }

  /**
   * Evaluate a single requirement
   * @param requirement The requirement to evaluate
   * @returns True if the requirement is met, false otherwise
   */
  private evaluateRequirement(requirement: StageRequirement): boolean {
    try {
      const { type, target, value, operator = '>=' } = requirement;
      const state = store.getState();

      switch (type) {
        case 'resourceAmount': {
          if (!target) {
            this.debugLog(`Warning: No target provided for resourceAmount requirement`);
            return false;
          }
          
          // Get resource amount from state
          try {
            const resources = state.resources;
            if (!resources || !target) {
              this.debugLog(`Warning: Resources not available or target is undefined`);
              return false;
            }
            
            // Get resource using properly typed access
            // Use safe access for indexing with type assertion
            const resource = (typeof target === 'string' && target in resources) ? 
              (resources as Record<string, any>)[target] : undefined;
            if (!resource) {
              this.debugLog(`Warning: Resource ${target} not found`);
              return false;
            }
            
            // Verify the resource has a numeric amount
            if (typeof resource.amount !== 'number') {
              this.debugLog(`Warning: Resource ${target} has invalid amount`);
              return false;
            }
            
            return this.compareValues(resource.amount, value, operator);
          } catch (error) {
            this.debugLog(`Error accessing resource ${target}: ${error}`);
            return false;
          }
        }
        
        case 'resourceRate': {
          if (!target) {
            this.debugLog(`Warning: No target provided for resourceRate requirement`);
            return false;
          }
          
          // Get resource generation rate from state
          try {
            const resources = state.resources;
            if (!resources || !target) {
              this.debugLog(`Warning: Resources not available or target is undefined`);
              return false;
            }
            
            // Get resource using properly typed access
            const resource = (typeof target === 'string' && target in resources) ? 
              (resources as Record<string, any>)[target] : undefined;
            if (!resource) {
              this.debugLog(`Warning: Resource ${target} not found`);
              return false;
            }
            
            // Verify the resource has a numeric perSecond rate
            if (typeof resource.perSecond !== 'number') {
              this.debugLog(`Warning: Resource ${target} has invalid perSecond rate`);
              return false;
            }
            
            return this.compareValues(resource.perSecond, value, operator);
          } catch (error) {
            this.debugLog(`Error accessing resource rate for ${target}: ${error}`);
            return false;
          }
        }
        
        case 'milestonesCompleted': {
          const completedMilestones = selectCompletedMilestones(state);
          
          if (target) {
            // Check milestones of a specific type
            const milestoneType = target as MilestoneType;
            const typeCount = completedMilestones.filter(m => m.type === milestoneType).length;
            return this.compareValues(typeCount, value, operator);
          } else {
            // Check total completed milestones
            return this.compareValues(completedMilestones.length, value, operator);
          }
        }
        
        case 'achievementsUnlocked': {
          const unlockedAchievements = selectUnlockedAchievements(state);
          
          if (target) {
            // Check achievements of a specific type
            const achievementType = target as AchievementType;
            const typeCount = unlockedAchievements.filter(a => a.type === achievementType).length;
            return this.compareValues(typeCount, value, operator);
          } else {
            // Check total unlocked achievements
            return this.compareValues(unlockedAchievements.length, value, operator);
          }
        }
        
        case 'gameStage': {
          const currentStage = selectCurrentStage(state);
          const stageValues = {
            [GameStage.EARLY]: 1,
            [GameStage.MID]: 2,
            [GameStage.LATE]: 3,
            [GameStage.END_GAME]: 4
          };
          
          const currentStageValue = stageValues[currentStage];
          const requiredStageValue = stageValues[value as GameStage];
          
          if (currentStageValue === undefined || requiredStageValue === undefined) {
            this.debugLog(`Warning: Invalid stage value for gameStage requirement`);
            return false;
          }
          
          return this.compareValues(currentStageValue, requiredStageValue, operator);
        }
        
        case 'gameTime': {
          const gameStartTime = state.game.startDate;
          const currentTime = getCurrentTime();
          const gameTimeElapsed = (currentTime - gameStartTime) / 1000; // Convert to seconds
          
          return this.compareValues(gameTimeElapsed, value, operator);
        }
        
        default:
          this.debugLog(`Warning: Unknown requirement type: ${type}`);
          return false;
      }
    } catch (error) {
      console.error('Error evaluating requirement:', error);
      return false;
    }
  }

  /**
   * Compare two values using the specified operator
   * @param actual The actual value
   * @param expected The expected value
   * @param operator The comparison operator
   * @returns Result of the comparison
   */
  private compareValues(
    actual: number | string | boolean,
    expected: number | string | boolean,
    operator: '>=' | '>' | '=' | '<' | '<='
  ): boolean {
    // Convert to numbers if comparing numeric strings
    if (typeof actual === 'string' && !isNaN(Number(actual)) && 
        typeof expected === 'string' && !isNaN(Number(expected))) {
      actual = Number(actual);
      expected = Number(expected);
    }
    
    // Ensure same type for comparison
    if (typeof actual !== typeof expected) {
      this.debugLog(`Warning: Type mismatch in comparison: ${typeof actual} vs ${typeof expected}`);
      return false;
    }
    
    switch (operator) {
      case '>=':
        return actual >= expected;
      case '>':
        return actual > expected;
      case '=':
        return actual === expected;
      case '<':
        return actual < expected;
      case '<=':
        return actual <= expected;
      default:
        this.debugLog(`Warning: Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Check if a milestone can be completed
   * @param milestoneId ID of the milestone to check
   * @returns True if the milestone can be completed, false otherwise
   */
  public canCompleteMilestone(milestoneId: string): boolean {
    try {
      const state = store.getState();
      const milestone = selectMilestoneById(state, milestoneId);
      
      if (!milestone) {
        this.debugLog(`Warning: Milestone ${milestoneId} not found`);
        return false;
      }
      
      if (milestone.completed) {
        this.debugLog(`Milestone ${milestoneId} is already completed`);
        return false;
      }
      
      return this.checkRequirements(milestone.requirements);
    } catch (error) {
      console.error(`Error checking if milestone ${milestoneId} can be completed:`, error);
      return false;
    }
  }

  /**
   * Complete a milestone
   * @param milestoneId ID of the milestone to complete
   * @returns True if the milestone was completed, false otherwise
   */
  public completeMilestone(milestoneId: string): boolean {
    try {
      if (!this.canCompleteMilestone(milestoneId)) {
        return false;
      }
      
      // Get the milestone
      const state = store.getState();
      const milestone = selectMilestoneById(state, milestoneId);
      
      if (!milestone) {
        this.debugLog(`Warning: Milestone ${milestoneId} not found during completion`);
        return false;
      }
      
      // Complete the milestone
      store.dispatch(completeMilestone({
        id: milestoneId,
        completedAt: getCurrentTime()
      }));
      
      this.debugLog(`Milestone ${milestoneId} completed`);
      
      // Apply milestone rewards if any
      if (milestone.rewards && milestone.rewards.length > 0) {
        this.applyMilestoneRewards(milestoneId);
      }
      
      // Check if we can advance to a new game stage
      this.checkStageAdvancement();
      
      return true;
    } catch (error) {
      console.error(`Error completing milestone ${milestoneId}:`, error);
      return false;
    }
  }
  
  /**
   * Apply rewards for completing a milestone
   * @param milestoneId ID of the milestone
   */
  private applyMilestoneRewards(milestoneId: string): void {
    try {
      const state = store.getState();
      const milestone = selectMilestoneById(state, milestoneId);
      
      if (!milestone || !milestone.rewards || milestone.rewards.length === 0) {
        return;
      }
      
      for (const reward of milestone.rewards) {
        this.applyMilestoneReward(reward);
      }
      
      this.debugLog(`Applied rewards for milestone ${milestoneId}`);
    } catch (error) {
      console.error(`Error applying rewards for milestone ${milestoneId}:`, error);
    }
  }
  
  /**
   * Apply a single milestone reward
   * @param reward The reward to apply
   */
  private applyMilestoneReward(reward: any): void {
    try {
      const { type, target, value } = reward;
      
      switch (type) {
        case 'resource':
          if (!target) {
            this.debugLog(`Warning: No target provided for resource reward`);
            return;
          }
          
          // Add resource amount
          store.dispatch({
            type: 'resources/addResourceAmount',
            payload: {
              id: target,
              amount: Number(value)
            }
          });
          break;
          
        case 'boost':
          if (!target) {
            this.debugLog(`Warning: No target provided for boost reward`);
            return;
          }
          
          // Apply boost to resource production
          store.dispatch(
            // Use updateResourcePerSecond instead of custom actions
            updateResourcePerSecond({
              id: target,
              // Get current rate and add the boost
              perSecond: (store.getState().resources[target]?.perSecond || 0) + Number(value)
            })
          );
          break;
          
        case 'multiplier':
          if (!target) {
            this.debugLog(`Warning: No target provided for multiplier reward`);
            return;
          }
          
          // Apply multiplier to resource production
          const currentRate = store.getState().resources[target]?.perSecond || 0;
          store.dispatch(
            // Use updateResourcePerSecond instead of custom actions
            updateResourcePerSecond({
              id: target,
              perSecond: currentRate * Number(value)
            })
          );
          break;
          
        case 'unlockFeature':
          // Feature unlocking is handled by the milestone's unlocks property
          this.debugLog(`Feature unlock: ${target} = ${value}`);
          break;
          
        default:
          this.debugLog(`Warning: Unknown reward type: ${type}`);
      }
    } catch (error) {
      console.error('Error applying milestone reward:', error);
    }
  }

  /**
   * Check if an achievement can be unlocked
   * @param achievementId ID of the achievement to check
   * @returns True if the achievement can be unlocked, false otherwise
   */
  public canUnlockAchievement(achievementId: string): boolean {
    try {
      const state = store.getState();
      const achievement = selectAchievementById(state, achievementId);
      
      if (!achievement) {
        this.debugLog(`Warning: Achievement ${achievementId} not found`);
        return false;
      }
      
      if (achievement.unlocked) {
        this.debugLog(`Achievement ${achievementId} is already unlocked`);
        return false;
      }
      
      return this.checkRequirements(achievement.requirements);
    } catch (error) {
      console.error(`Error checking if achievement ${achievementId} can be unlocked:`, error);
      return false;
    }
  }

  /**
   * Unlock an achievement
   * @param achievementId ID of the achievement to unlock
   * @returns True if the achievement was unlocked, false otherwise
   */
  public unlockAchievement(achievementId: string): boolean {
    try {
      if (!this.canUnlockAchievement(achievementId)) {
        return false;
      }
      
      // Unlock the achievement
      store.dispatch(unlockAchievement({
        id: achievementId,
        unlockedAt: getCurrentTime()
      }));
      
      // Apply achievement rewards
      this.applyAchievementRewards(achievementId);
      
      this.debugLog(`Achievement ${achievementId} unlocked`);
      return true;
    } catch (error) {
      console.error(`Error unlocking achievement ${achievementId}:`, error);
      return false;
    }
  }

  /**
   * Apply rewards for unlocking an achievement
   * @param achievementId ID of the achievement
   */
  private applyAchievementRewards(achievementId: string): void {
    try {
      const state = store.getState();
      const achievement = selectAchievementById(state, achievementId);
      
      if (!achievement || !achievement.rewards || achievement.rewards.length === 0) {
        return;
      }
      
      for (const reward of achievement.rewards) {
        this.applyReward(reward);
      }
    } catch (error) {
      console.error(`Error applying rewards for achievement ${achievementId}:`, error);
    }
  }

  /**
   * Apply a single achievement reward
   * @param reward The reward to apply
   */
  private applyReward(reward: AchievementReward): void {
    try {
      const { type, target, value } = reward;
      
      switch (type) {
        case 'resource':
          if (!target) {
            this.debugLog(`Warning: No target provided for resource reward`);
            return;
          }
          
          // Add resource amount
          store.dispatch({
            type: 'resources/addResourceAmount',
            payload: {
              id: target,
              amount: Number(value)
            }
          });
          break;
          
        case 'boost':
          if (!target) {
            this.debugLog(`Warning: No target provided for boost reward`);
            return;
          }
          
          // Apply boost to resource production
          store.dispatch({
            type: 'resources/setResourcePerSecond',
            payload: {
              id: target,
              perSecond: Number(value)
            }
          });
          break;
          
        case 'unlockFeature':
          // Feature unlocking would be handled by other systems
          this.debugLog(`Feature unlocking not implemented yet: ${target} = ${value}`);
          break;
          
        default:
          this.debugLog(`Warning: Unknown reward type: ${type}`);
      }
    } catch (error) {
      console.error('Error applying reward:', error);
    }
  }

  /**
   * Check if the game can advance to a new stage
   * @returns True if a stage advancement occurred, false otherwise
   */
  public checkStageAdvancement(): boolean {
    try {
      const state = store.getState();
      const currentStage = selectCurrentStage(state);
      const completedMilestones = selectCompletedMilestones(state);
      
      // Define requirements for each stage
      const stageRequirements: Record<GameStage, number> = {
        [GameStage.EARLY]: 0, // Starting stage
        [GameStage.MID]: 5,   // Need 5 early stage milestones to advance to MID
        [GameStage.LATE]: 10, // Need 10 milestones to advance to LATE
        [GameStage.END_GAME]: 15 // Need 15 milestones to advance to END_GAME
      };
      
      let nextStage: GameStage | null = null;
      
      // Determine next stage based on current stage
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
        case GameStage.END_GAME:
          return false; // Already at the final stage
        default:
          this.debugLog(`Warning: Unknown current stage: ${currentStage}`);
          return false;
      }
      
      // Check if we have enough completed milestones for the next stage
      if (completedMilestones.length >= stageRequirements[nextStage]) {
        store.dispatch(advanceGameStage({
          stage: nextStage,
          reachedAt: getCurrentTime()
        }));
        
        this.debugLog(`Advanced to game stage: ${nextStage}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking stage advancement:', error);
      return false;
    }
  }

  /**
   * Check if a specific feature should be unlocked based on progression
   * @param featureId ID of the feature to check
   * @returns True if the feature should be unlocked, false otherwise
   */
  public shouldFeatureBeUnlocked(featureId: string): boolean {
    try {
      const state = store.getState();
      const completedMilestones = selectCompletedMilestones(state);
      
      // Check if any completed milestone unlocks this feature
      for (const milestone of completedMilestones) {
        if (milestone.unlocks && milestone.unlocks.includes(featureId)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking if feature ${featureId} should be unlocked:`, error);
      return false;
    }
  }

  /**
   * Check if all milestones and achievements that can be completed/unlocked are
   * @returns Number of items that were completed/unlocked
   */
  public checkAllProgressionItems(): number {
    let itemsUpdated = 0;
    
    try {
      const state = store.getState();
      const visibleMilestones = selectVisibleMilestones(state);
      const visibleAchievements = selectVisibleAchievements(state);
      
      // Check milestones
      for (const milestone of visibleMilestones) {
        if (!milestone.completed && this.completeMilestone(milestone.id)) {
          itemsUpdated++;
        }
      }
      
      // Check achievements
      for (const achievement of visibleAchievements) {
        if (!achievement.unlocked && this.unlockAchievement(achievement.id)) {
          itemsUpdated++;
        }
      }
    } catch (error) {
      console.error('Error checking all progression items:', error);
    }
    
    if (itemsUpdated > 0) {
      this.debugLog(`Updated ${itemsUpdated} progression items`);
    }
    
    return itemsUpdated;
  }
  
  /**
   * Check milestone progress after resource changes
   * This is used by clicking and other resource-changing actions
   * @returns Number of milestones that were completed
   */
  public checkMilestoneProgress(): number {
    let milestonesCompleted = 0;
    
    try {
      const state = store.getState();
      const visibleMilestones = selectVisibleMilestones(state);
      const oppression = this.getOppressionFactor();
      
      // Check only milestones
      for (const milestone of visibleMilestones) {
        // Skip completed milestones
        if (milestone.completed) continue;
        
        // Check if all maintenance requirements are met
        const maintenanceRequirements = milestone.requirements.filter(req => req.maintenance);
        const allMaintenanceMet = maintenanceRequirements.length === 0 || 
          maintenanceRequirements.every(req => this.evaluateRequirement(req));
        
        // If maintenance requirements are not met, skip this milestone
        if (!allMaintenanceMet) continue;
        
        // Complete the milestone if all requirements are met
        if (this.completeMilestone(milestone.id)) {
          milestonesCompleted++;
        }
      }
    } catch (error) {
      console.error('Error checking milestone progress:', error);
    }
    
    if (milestonesCompleted > 0) {
      this.debugLog(`Completed ${milestonesCompleted} milestones from resource changes`);
    }
    
    return milestonesCompleted;
  }
  
  /**
   * Calculate the current milestone progress percentage with oppression effects
   * @param milestoneId ID of the milestone to calculate progress for
   * @returns Progress percentage (0-100)
   */
  public calculateMilestoneProgress(milestoneId: string): number {
    try {
      const state = store.getState();
      const milestone = selectMilestoneById(state, milestoneId);
      
      if (!milestone) {
        return 0;
      }
      
      // If milestone is already completed, return 100%
      if (milestone.completed) {
        return 100;
      }
      
      // Get oppression factor (higher oppression = slower progress)
      const oppressionFactor = this.getOppressionFactor();
      
      // Check if maintenance requirements are met (resource rates, etc.)
      const maintenanceRequirements = milestone.requirements.filter(req => req.maintenance);
      const allMaintenanceMet = maintenanceRequirements.length === 0 || 
        maintenanceRequirements.every(req => this.evaluateRequirement(req));
      
      // If maintenance requirements are not met, progress is halted
      if (!allMaintenanceMet) {
        return 0;
      }
      
      // Calculate progress for regular resource requirements
      let totalProgress = 0;
      let requirementCount = 0;
      
      for (const req of milestone.requirements) {
        // Skip maintenance requirements, handled above
        if (req.maintenance) continue;
        
        if (req.type === 'resourceAmount' && req.target) {
          const resources = state.resources;
          const resource = (resources as Record<string, any>)[req.target];
          
          if (!resource) continue;
          
          const currentAmount = resource.amount;
          const requiredAmount = typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());
          
          // Calculate raw progress percentage
          let progress = Math.min(100, (currentAmount / requiredAmount) * 100);
          
          // Apply oppression effect to slow down progress
          progress = Math.max(0, progress - (oppressionFactor * 10));
          
          totalProgress += progress;
          requirementCount++;
        } else {
          // For non-resource requirements, check if met
          const isRequirementMet = this.evaluateRequirement(req);
          totalProgress += isRequirementMet ? 100 : 0;
          requirementCount++;
        }
      }
      
      // Calculate average progress across all requirements
      return requirementCount > 0 ? Math.max(0, totalProgress / requirementCount) : 0;
    } catch (error) {
      console.error(`Error calculating milestone progress for ${milestoneId}:`, error);
      return 0;
    }
  }
  
  /**
   * Get the current oppression factor affecting milestone progress
   * @returns Oppression factor (0-1)
   */
  private getOppressionFactor(): number {
    try {
      const state = store.getState();
      
      // Get oppression and power resources
      const oppression = (state.resources['corporate-oppression']?.amount || 0) as number;
      const power = (state.resources['collective-power']?.amount || 1) as number;
      
      // Calculate ratio of oppression to power (higher = more oppression)
      const ratio = Math.min(1, oppression / (power || 1));
      
      // Apply game stage multiplier - oppression gets more effective in later stages
      const currentStage = selectCurrentStage(state);
      const stageMultiplier = {
        [GameStage.EARLY]: 0.5,
        [GameStage.MID]: 0.75,
        [GameStage.LATE]: 1.0,
        [GameStage.END_GAME]: 1.25
      }[currentStage] || 0.5;
      
      return ratio * stageMultiplier;
    } catch (error) {
      console.error('Error calculating oppression factor:', error);
      return 0;
    }
  }

  /**
   * Get the percentage completion for the current stage
   * @returns Percentage as a number between 0 and 100
   */
  public getCurrentStageCompletionPercentage(): number {
    try {
      const state = store.getState();
      const currentStage = selectCurrentStage(state);
      const allMilestones = state.progression.milestonesByStage[currentStage] || [];
      
      if (allMilestones.length === 0) {
        return 0;
      }
      
      const completedCount = allMilestones.filter(id => 
        state.progression.milestones[id]?.completed
      ).length;
      
      return Math.round((completedCount / allMilestones.length) * 100);
    } catch (error) {
      console.error('Error calculating stage completion percentage:', error);
      return 0;
    }
  }

  /**
   * Get the overall game completion percentage
   * @returns Percentage as a number between 0 and 100
   */
  public getOverallCompletionPercentage(): number {
    try {
      const state = store.getState();
      const allMilestones = state.progression.milestoneIds || [];
      const allAchievements = state.progression.achievementIds || [];
      
      if (allMilestones.length === 0 && allAchievements.length === 0) {
        return 0;
      }
      
      const completedMilestones = allMilestones.filter(id => 
        state.progression.milestones[id]?.completed
      ).length;
      
      const unlockedAchievements = allAchievements.filter(id => 
        state.progression.achievements[id]?.unlocked
      ).length;
      
      const totalItems = allMilestones.length + allAchievements.length;
      const completedItems = completedMilestones + unlockedAchievements;
      
      return Math.round((completedItems / totalItems) * 100);
    } catch (error) {
      console.error('Error calculating overall completion percentage:', error);
      return 0;
    }
  }

  /**
   * Log a debug message if debugging is enabled
   * @param message Message to log
   */
  private debugLog(message: string): void {
    if (this.debuggingEnabled) {
      console.log(`[ProgressionManager] ${message}`);
    }
  }
}