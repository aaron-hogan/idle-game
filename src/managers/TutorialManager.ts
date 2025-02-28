import { Store } from '@reduxjs/toolkit';
import { tutorialContent, contextualHelpContent } from '../data/tutorialContent';
import { RootState } from '../state/store';
import {
  completeTutorial,
  setActiveTutorial,
  setCurrentStep,
  setFirstTimeUser,
  setTutorialsEnabled,
} from '../state/tutorialSlice';
import { TutorialContextHelp, TutorialStep } from '../types/tutorial';

/**
 * TutorialManager is responsible for handling the tutorial system
 * and contextual help throughout the game
 */
export class TutorialManager {
  private static instance: TutorialManager;
  private store: Store<RootState> | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance of TutorialManager
   */
  public static getInstance(): TutorialManager {
    if (!TutorialManager.instance) {
      TutorialManager.instance = new TutorialManager();
    }
    return TutorialManager.instance;
  }

  /**
   * Initialize the tutorial manager with the Redux store
   */
  public initialize(store: Store<RootState>): void {
    this.store = store;
    this.checkFirstTimeUser();
  }

  /**
   * Check if this is a first-time user and show welcome tutorial if so
   */
  private checkFirstTimeUser(): void {
    if (!this.store) return;

    const state = this.store.getState();
    const { firstTimeUser, tutorialsEnabled } = state.tutorial;

    if (firstTimeUser && tutorialsEnabled) {
      this.startTutorial(TutorialStep.WELCOME);
    }
  }

  /**
   * Start a specific tutorial step
   */
  public startTutorial(step: TutorialStep): void {
    if (!this.store) return;

    this.store.dispatch(setActiveTutorial(true));
    this.store.dispatch(setCurrentStep(step));
  }

  /**
   * Complete the current tutorial step and move to the next if available
   */
  public completeCurrentStep(): void {
    if (!this.store) return;

    const state = this.store.getState();
    const { currentStep } = state.tutorial;

    if (currentStep) {
      this.store.dispatch(completeTutorial(currentStep));

      const tutorial = tutorialContent[currentStep as TutorialStep];
      if (tutorial.nextStep) {
        this.store.dispatch(setCurrentStep(tutorial.nextStep));
      } else {
        this.store.dispatch(setActiveTutorial(false));
        this.store.dispatch(setCurrentStep(null));
      }
    }
  }

  /**
   * Move to the previous tutorial step if available
   */
  public goToPreviousStep(): void {
    if (!this.store) return;

    const state = this.store.getState();
    const { currentStep } = state.tutorial;

    if (currentStep) {
      const tutorial = tutorialContent[currentStep as TutorialStep];
      if (tutorial.previousStep) {
        this.store.dispatch(setCurrentStep(tutorial.previousStep));
      }
    }
  }

  /**
   * Skip the current tutorial
   */
  public skipTutorial(): void {
    if (!this.store) return;

    this.store.dispatch(setActiveTutorial(false));
    this.store.dispatch(setCurrentStep(null));
  }

  /**
   * Enable or disable tutorials
   */
  public setTutorialsEnabled(enabled: boolean): void {
    if (!this.store) return;

    this.store.dispatch(setTutorialsEnabled(enabled));

    if (!enabled) {
      this.skipTutorial();
    }
  }

  /**
   * Set first time user flag
   */
  public setFirstTimeUser(isFirstTime: boolean): void {
    if (!this.store) return;

    this.store.dispatch(setFirstTimeUser(isFirstTime));
  }

  /**
   * Get contextual help for a specific element
   */
  public getContextualHelp(id: string): TutorialContextHelp | undefined {
    return contextualHelpContent.find((help) => help.id === id);
  }

  /**
   * Get current tutorial content
   */
  public getCurrentTutorialContent() {
    if (!this.store) return null;

    const state = this.store.getState();
    const { currentStep } = state.tutorial;

    if (currentStep) {
      return tutorialContent[currentStep as TutorialStep];
    }

    return null;
  }

  /**
   * Check if a tutorial has been completed
   */
  public isTutorialCompleted(tutorialId: string): boolean {
    if (!this.store) return false;

    const state = this.store.getState();
    return state.tutorial.completedTutorials.includes(tutorialId);
  }
}
