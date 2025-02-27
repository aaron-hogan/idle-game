/**
 * Tutorial system types
 */

export enum TutorialStep {
  WELCOME = 'WELCOME',
  RESOURCES = 'RESOURCES',
  BUILDINGS = 'BUILDINGS',
  WORKERS = 'WORKERS',
  EVENTS = 'EVENTS',
  MILESTONES = 'MILESTONES',
  SETTINGS = 'SETTINGS',
}

export enum TutorialCategory {
  BASICS = 'BASICS',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface TutorialContent {
  id: string;
  title: string;
  content: string;
  category: TutorialCategory;
  step: TutorialStep;
  image?: string;
  nextStep?: TutorialStep;
  previousStep?: TutorialStep;
  showOnce?: boolean;
  required?: boolean;
}

export interface TutorialContextHelp {
  id: string;
  title: string;
  content: string;
  relatedTutorials?: string[];
}

export interface TutorialState {
  active: boolean;
  currentStep: TutorialStep | null;
  completedTutorials: string[];
  tutorialsEnabled: boolean;
  firstTimeUser: boolean;
  showContextualHelp: boolean;
}