import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TutorialModal from '../TutorialModal';
import { TutorialStep, TutorialCategory } from '../../../types/tutorial';
import { TutorialManager } from '../../../managers/TutorialManager';

// Mock the TutorialManager instance
jest.mock('../../../managers/TutorialManager', () => {
  const mockInstance = {
    completeCurrentStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    skipTutorial: jest.fn(),
    getCurrentTutorialContent: jest.fn().mockReturnValue({
      id: 'resources',
      title: 'Resources',
      content: 'Resources are the foundation of your community.',
      category: 'BASICS',
      step: 'RESOURCES',
      nextStep: 'BUILDINGS',
      previousStep: 'WELCOME',
    }),
  };
  
  return {
    TutorialManager: {
      getInstance: jest.fn().mockReturnValue(mockInstance),
    },
  };
});

const mockStore = configureStore([]);

describe('TutorialModal', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      tutorial: {
        active: true,
        currentStep: TutorialStep.RESOURCES,
        completedTutorials: [],
        tutorialsEnabled: true,
        firstTimeUser: true,
        showContextualHelp: true,
      },
    });
  });
  
  it('renders when active is true', () => {
    render(
      <Provider store={store}>
        <TutorialModal />
      </Provider>
    );
    
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Resources are the foundation of your community.')).toBeInTheDocument();
  });
  
  it('does not render when active is false', () => {
    store = mockStore({
      tutorial: {
        active: false,
        currentStep: TutorialStep.RESOURCES,
        completedTutorials: [],
        tutorialsEnabled: true,
        firstTimeUser: true,
        showContextualHelp: true,
      },
    });
    
    const { container } = render(
      <Provider store={store}>
        <TutorialModal />
      </Provider>
    );
    
    expect(container.firstChild).toBeNull();
  });
  
  it('calls completeCurrentStep when next button is clicked', () => {
    render(
      <Provider store={store}>
        <TutorialModal />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Next'));
    
    expect(TutorialManager.getInstance().completeCurrentStep).toHaveBeenCalled();
  });
  
  it('calls goToPreviousStep when previous button is clicked', () => {
    render(
      <Provider store={store}>
        <TutorialModal />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Previous'));
    
    expect(TutorialManager.getInstance().goToPreviousStep).toHaveBeenCalled();
  });
  
  it('calls skipTutorial when close button is clicked', () => {
    render(
      <Provider store={store}>
        <TutorialModal />
      </Provider>
    );
    
    fireEvent.click(screen.getByLabelText('Close tutorial'));
    
    expect(TutorialManager.getInstance().skipTutorial).toHaveBeenCalled();
  });
});