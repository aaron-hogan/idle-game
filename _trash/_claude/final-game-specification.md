# Anti-Capitalist Idle Game
## Developer Specification Document
**Version 1.0 | February 24, 2025**

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Requirements](#2-requirements)
3. [Architecture Choices](#3-architecture-choices)
4. [Data Handling Details](#4-data-handling-details)
5. [Error Handling Strategies](#5-error-handling-strategies)
6. [Testing Plan](#6-testing-plan)
7. [Implementation Plan](#7-implementation-plan)
8. [Game Content Details](#8-game-content-details)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Project Overview
A semi-idle game with anti-capitalist themes that allows players to build collective power and eventually overthrow capitalism through an anarcho-syndicalist approach. The game features a human-centered aesthetic with a simplified visual style similar to Cookie Clicker or Rusty's Retirement, appearing as an "ant farm of revolution" that can run in a small window on a player's monitor.

### 1.2 Purpose
To create an engaging game that combines idle mechanics with active decision-making, educating players about anti-capitalist concepts while providing an entertaining experience that demonstrates how collective organization can create systemic change.

### 1.3 Scope
- A browser-based game that can run in a small window
- Semi-idle gameplay that progresses when the player is away but requires active involvement for optimal results
- Focus on building collective bargaining power as the central resource
- Progressive development from initial organizing to revolutionary action
- Humorous tone that makes serious concepts accessible
- Educational elements that introduce players to anarcho-syndicalist principles

### 1.4 Target Audience
- Players interested in idle/incremental games
- Individuals interested in anti-capitalist theory and practice
- Casual gamers who enjoy games they can check in on periodically
- Players who appreciate games with social commentary

---

## 2. Requirements

### 2.1 Functional Requirements

#### 2.1.1 Core Gameplay Loop
1. **Resource Generation**
   - Players accumulate collective bargaining power through various activities and structures
   - Secondary resources include solidarity, community trust, and direct action points
   - Resources continue to generate while the player is away, but at a reduced rate
   - Resource generation rates should scale with player progression

2. **Building and Development**
   - Players construct and upgrade various structures that support the revolutionary movement
   - Each structure provides unique benefits and resource generation
   - Structures visually transform as they are upgraded, showing progress
   - Buildings have maintenance costs that must be balanced with their benefits

3. **Organizing Activities**
   - Players actively assign organizers to different tasks
   - Tasks include worker outreach, community education, mutual aid, and eventually direct action
   - Tasks have varying completion times, resource costs, and rewards
   - Some tasks unlock new game features or structures

4. **Opposition and Resistance**
   - The game features escalating opposition from capitalist forces
   - Opposition includes police repression, corporate propaganda, infiltration attempts
   - Players must develop counter-strategies to overcome these obstacles
   - Opposition strength scales with player progress and becomes more sophisticated

5. **Moral Decision System**
   - Players face difficult choices between ideological purity and practical effectiveness
   - Decisions about acceptable tactics that might alienate potential allies
   - Choices have both immediate and long-term consequences for the movement
   - No single "correct" path - all choices involve trade-offs

6. **Revolutionary Progression**
   - The game subtly progresses through different stages of revolutionary activity
   - Early game focuses on organizing and education
   - Mid-game introduces direct action and resistance
   - Late game includes sabotage and revolutionary takeover
   - Progress is marked by unlockable content and visual changes

7. **Event System**
   - Random and triggered events that require player response
   - Events can provide opportunities or create challenges
   - Some events are based on historical labor movements and struggles
   - Event frequency and type should vary based on game stage

8. **Achievement System**
   - Unlockable achievements for reaching milestones
   - Secret achievements for discovering alternative strategies
   - Achievements provide permanent bonuses to resource generation
   - Achievement display that shows progress in the revolution

### 2.2 Non-Functional Requirements

1. **Performance**
   - Game must run smoothly in a small browser window (minimum 400x600 pixels)
   - Minimal resource usage to allow background running (maximum 5% CPU usage when idle)
   - Efficient calculation of idle progression (handling up to 7 days of offline progress)
   - Maximum initial load time of 3 seconds on standard broadband connection

2. **User Experience**
   - Clean, intuitive interface with minimal clutter
   - Visual feedback for all player actions
   - Clear indication of current objectives and progress
   - Tooltips and help text to explain concepts and mechanics
   - Color-coded resource indicators for quick status assessment
   - Consistent iconography for similar actions and resources

3. **Accessibility**
   - Color-blind friendly design with multiple color schemes
   - Adjustable text size (minimum 12pt, scalable to 24pt)
   - Keyboard shortcuts for common actions
   - Screen reader compatibility for all game text
   - Option to reduce animations for users with motion sensitivity

4. **Educational Value**
   - Accurate representation of anarcho-syndicalist concepts
   - Educational tooltips explaining real-world parallels
   - References to historical labor movements and actions
   - In-game encyclopedia of anti-capitalist concepts

5. **Modularity**
   - Codebase structured to allow easy addition of new content
   - Component-based design for UI elements
   - Data-driven design for game entities and events
   - Clear separation of game logic and presentation

### 2.3 User Stories

1. **New Player**
   - "As a new player, I want a clear tutorial that introduces me to the basic concepts so I can understand how to progress."
   - "As a new player, I want early achievements that give me a sense of accomplishment and teach me the mechanics."
   - "As a new player, I want to understand what resources are most important so I can focus my strategy."

2. **Casual Player**
   - "As a casual player, I want to check in on my game a few times a day and see meaningful progress."
   - "As a casual player, I want notification icons that show me what needs my attention when I return."
   - "As a casual player, I want automated systems that keep the game running efficiently when I'm away."

3. **Engaged Player**
   - "As an engaged player, I want complex strategic decisions that make me consider the trade-offs between different approaches."
   - "As an engaged player, I want deep systems that reward my investment of time and thought."
   - "As an engaged player, I want to experiment with different revolutionary strategies and see their outcomes."

4. **Returning Player**
   - "As a returning player, I want a summary of what happened while I was away."
   - "As a returning player, I want to immediately address any crises or opportunities that arose during my absence."
   - "As a returning player, I want to quickly re-engage with my previous strategies."

5. **Politically Interested Player**
   - "As a politically interested player, I want accurate representation of anti-capitalist concepts so I can learn while playing."
   - "As a politically interested player, I want to see how different organizing strategies would work in practice."
   - "As a politically interested player, I want references to historical movements to understand real-world applications."

---

## 3. Architecture Choices

### 3.1 System Architecture
The game will use a client-side architecture with:
- Front-end UI layer for rendering and user interaction
- Game logic layer for mechanics and calculations
- Data persistence layer (localStorage or IndexedDB) for saving progress
- Event system for managing game events and player responses
- Resource management system for tracking and updating resources
- Structure management system for building and upgrading
- Task management system for assigning and completing activities

### 3.2 Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript/TypeScript
- **Framework**: React for component-based development
- **State Management**: Redux for centralized game state
- **Graphics**: SVG for scalable graphics with minimal file size
- **Storage**: localStorage for basic saves, IndexedDB for larger save files
- **Build Tools**: Webpack, Babel, ESLint
- **Package Management**: npm or yarn

### 3.3 Design Patterns
- **Observer Pattern**: For event handling and UI updates
- **Factory Pattern**: For creating game entities (structures, tasks, events)
- **Strategy Pattern**: For implementing different AI behaviors for opposition
- **Command Pattern**: For handling user inputs and actions
- **Singleton Pattern**: For global game state management
- **Decorator Pattern**: For applying upgrades and modifiers to game entities
- **Pub/Sub Pattern**: For communication between game systems

### 3.4 Code Organization
- **src/components/**: UI components organized by feature
- **src/state/**: State management (actions, reducers, selectors)
- **src/models/**: Data models and interfaces
- **src/systems/**: Game systems (resources, buildings, events)
- **src/utils/**: Utility functions and helpers
- **src/constants/**: Game constants and configuration
- **src/assets/**: Images, icons, and other static assets
- **src/styles/**: Global styles and themes

---

## 4. Data Handling Details

### 4.1 Data Models

#### 4.1.1 Core Entities
1. **Resources**
   ```typescript
   interface Resource {
     id: string;                  // Unique identifier
     name: string;                // Display name
     description: string;         // Description and function
     amount: number;              // Current amount
     maxAmount: number;           // Maximum storage capacity
     baseGeneration: number;      // Base generation per second
     currentGeneration: number;   // Current modified generation rate
     unlocked: boolean;           // Whether visible to player
     category: ResourceCategory;  // Grouping for UI
     icon: string;                // UI representation
     modifiers: Modifier[];       // Applied effects
   }
   
   enum ResourceCategory {
     PRIMARY,
     SOCIAL,
     MATERIAL,
     IDEOLOGICAL
   }
   ```

2. **Buildings/Structures**
   ```typescript
   interface Structure {
     id: string;                          // Unique identifier
     name: string;                        // Display name
     description: string;                 // Description and function
     flavorText: string;                  // Thematic description
     level: number;                       // Current upgrade level
     maxLevel: number;                    // Maximum possible level
     baseCost: Record<string, number>;    // Base resources needed
     scalingFactor: number;               // Cost increase per level
     baseProduction: Record<string, number>; // Base resource generation
     currentProduction: Record<string, number>; // Current modified production
     unlockRequirements: Requirement[];   // Conditions to appear
     unlocked: boolean;                   // Whether visible to player
     purchased: boolean;                  // Whether owned by player
     workers: number;                     // Assigned organizers
     maxWorkers: number;                  // Maximum organizers
     efficiency: number;                  // Production multiplier
     upgradeEffects: UpgradeEffect[];     // Effects of upgrading
     category: StructureCategory;         // Grouping for UI
     icon: string;                        // UI representation
     modifiers: Modifier[];               // Applied effects
   }
   
   enum StructureCategory {
     ORGANIZING,
     PRODUCTION,
     INFRASTRUCTURE,
     DEFENSE,
     REVOLUTIONARY
   }
   
   interface UpgradeEffect {
     type: EffectType;
     resourceId?: string;
     structureId?: string;
     value: number;
     description: string;
   }
   ```

3. **Actions/Tasks**
   ```typescript
   interface Task {
     id: string;                       // Unique identifier
     name: string;                     // Display name
     description: string;              // Description and function
     duration: number;                 // Base completion time (seconds)
     currentDuration: number;          // Modified completion time
     cost: Record<string, number>;     // Resource cost to start
     rewards: Record<string, number>;  // Resources gained on completion
     unlockRequirements: Requirement[];// Conditions to appear
     unlocked: boolean;                // Whether visible to player
     inProgress: boolean;              // Whether currently active
     progress: number;                 // Completion percentage
     completionTime: number;           // Timestamp for completion
     repeatable: boolean;              // Can be performed multiple times
     category: TaskCategory;           // Grouping for UI
     workers: number;                  // Assigned organizers
     minWorkers: number;               // Minimum required organizers
     maxWorkers: number;               // Maximum possible organizers
     icon: string;                     // UI representation
     consequences: Consequence[];      // Possible outcomes
     modifiers: Modifier[];            // Applied effects
   }
   
   enum TaskCategory {
     ORGANIZING,
     EDUCATION,
     DIRECT_ACTION,
     DEFENSE,
     REVOLUTIONARY
   }
   
   interface Consequence {
     type: ConsequenceType;
     chance: number;
     effect: () => void;
     description: string;
   }
   ```

4. **Events**
   ```typescript
   interface Event {
     id: string;                   // Unique identifier
     title: string;                // Display name
     description: string;          // Situation description
     backgroundInfo: string;       // Educational context
     triggerRequirements: Requirement[]; // Conditions to appear
     options: EventOption[];       // Possible responses
     triggered: boolean;           // Whether shown to player
     resolved: boolean;            // Whether completed
     category: EventCategory;      // Grouping for tracking
     urgency: EventUrgency;        // UI priority
     timeLimit: number;            // Seconds until auto-resolution
     icon: string;                 // UI representation
   }
   
   enum EventCategory {
     OPPORTUNITY,
     CRISIS,
     STORY,
     RANDOM
   }
   
   enum EventUrgency {
     LOW,
     MEDIUM,
     HIGH,
     CRITICAL
   }
   
   interface EventOption {
     text: string;
     requirements: Requirement[];
     effects: Effect[];
     consequences: string;
     unlocked: boolean;
   }
   ```

5. **Game State**
   ```typescript
   interface GameState {
     resources: Record<string, Resource>;  // All resources
     structures: Record<string, Structure>; // All buildings
     tasks: Record<string, Task>;          // All activities
     events: Record<string, Event>;        // All events
     activeEvents: string[];               // Currently active events
     completedEvents: string[];            // Resolved events
     unlockedFeatures: string[];           // Available game mechanics
     gameStage: number;                    // Current progression level
     revolutionProgress: number;           // Overall completion percentage
     lastSaveTime: number;                 // Timestamp of last save
     lastLoginTime: number;                // Timestamp of last session
     totalPlayTime: number;                // Cumulative seconds played
     achievements: string[];               // Completed achievements
     idleProcessingMode: IdleMode;         // How offline time is calculated
     version: string;                      // Save file version
     settings: GameSettings;               // User preferences
   }
   
   enum IdleMode {
     REALISTIC,  // Reduced gains when away
     OPTIMIZED,  // Full gains when away
     PAUSED      // No progression when away
   }
   
   interface GameSettings {
     soundEnabled: boolean;
     musicVolume: number;
     effectsVolume: number;
     textSize: TextSize;
     colorScheme: ColorScheme;
     notificationsEnabled: boolean;
     autosaveInterval: number;
     reducedAnimations: boolean;
     showTutorials: boolean;
   }
   ```

6. **Requirements and Effects**
   ```typescript
   type Requirement = 
     | ResourceRequirement
     | StructureRequirement
     | StageRequirement
     | AchievementRequirement;
   
   interface ResourceRequirement {
     type: 'RESOURCE';
     resourceId: string;
     amount: number;
     comparison: 'GREATER' | 'LESS' | 'EQUAL';
   }
   
   interface StructureRequirement {
     type: 'STRUCTURE';
     structureId: string;
     level: number;
     comparison: 'GREATER' | 'LESS' | 'EQUAL';
   }
   
   type Effect = 
     | ResourceEffect
     | StructureEffect
     | UnlockEffect
     | EventEffect;
   
   interface ResourceEffect {
     type: 'RESOURCE';
     resourceId: string;
     amount: number;
     operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'SET';
   }
   ```

### 4.2 Data Storage
- **Primary Storage**: Browser localStorage (for game state up to 5MB)
- **Extended Storage**: IndexedDB (for larger save files and backup)
- **Storage Format**: JSON with compression for large states
- **Versioned Saves**: Include version number for backward compatibility
- **Autosave**: Every 60 seconds during active play
- **Manual Save**: On-demand saving option
- **Export/Import**: Save data as downloadable JSON file
- **Cloud Backup**: Optional integration with browser account (future feature)

### 4.3 Data Flow
1. **User Actions**:
   - Player performs an action (click, assign worker, make decision)
   - Action is validated against requirements
   - Action effect is applied to game state
   - UI is updated to reflect changes
   - Related systems are notified of changes

2. **Idle Progression**:
   - On page load, calculate time since last visit
   - Apply time delta to resource generation systems
   - Calculate resources generated during absence
   - Apply any event probabilities based on time elapsed
   - Cap resources at maximum storage limits
   - Present summary of changes to player
   - Resume real-time updates

3. **Events and Decisions**:
   - Events trigger based on game state, random chance, or time triggers
   - Event is presented to player with options
   - Player selects option
   - Chosen effects are applied to game state
   - Event is marked as resolved
   - New events may be unlocked based on outcome

4. **Save/Load Cycle**:
   - Game state is serialized to JSON
   - JSON is compressed if necessary
   - Data is stored to localStorage or IndexedDB
   - On load, data is retrieved and decompressed
   - Compatibility check against current version
   - Migration applied if version mismatch
   - State is reconstructed and game resumes

### 4.4 Data Validation
- **Input Validation**: Check all user inputs for type and range
- **State Validation**: Verify game state integrity after loading
- **Consistency Checks**: Ensure resources don't exceed max values
- **Sanitization**: Clean user inputs before processing
- **Error Recovery**: Attempt to recover from corrupt save data

---

## 5. Error Handling Strategies

### 5.1 Error Types
1. **Data Corruption**:
   - Save file corruption
   - Invalid game state
   - Version compatibility issues

2. **Runtime Errors**:
   - JavaScript exceptions
   - Unexpected game state
   - Resource calculation errors

3. **User Interface Errors**:
   - Element rendering failures
   - Event handler exceptions
   - Animation glitches

4. **Browser Limitations**:
   - Storage quota exceeded
   - Performance degradation
   - Browser compatibility issues

### 5.2 Handling Mechanisms
1. **Save Data Protection**:
   - Maintain multiple autosave slots (rolling backups)
   - Validate save data before writing and after reading
   - Include checksums for data integrity verification
   - Graceful fallback to earlier save if corruption detected

2. **Exception Handling**:
   - Try-catch blocks around critical operations
   - Global error handler for uncaught exceptions
   - Custom error types for game-specific issues
   - Context-aware error recovery strategies

3. **State Verification**:
   - Periodic consistency checks on game state
   - Auto-correction of impossible values
   - Boundary enforcement for all numeric values
   - Resetting of stuck game processes

4. **Performance Management**:
   - Throttling of intensive calculations
   - Batching of UI updates
   - Reduced simulation fidelity when performance drops
   - Lazy loading of game components

### 5.3 User Feedback
1. **Error Messages**:
   - Clear, non-technical explanations of issues
   - Suggested recovery actions
   - Context-appropriate delivery (toast, modal, banner)
   - Severity-based styling (warning, error, critical)

2. **Recovery Options**:
   - One-click fixes for common issues
   - Manual save import option
   - Game state reset to stable checkpoint
   - Tutorial for avoiding similar issues

3. **Error Reporting**:
   - Optional anonymous error reporting
   - Capture of relevant game state for debugging
   - Error categorization for aggregation
   - Rate limiting to prevent spam

4. **Preventative Guidance**:
   - Tooltips for potentially problematic actions
   - Confirmation dialogs for destructive operations
   - Warnings when approaching system limitations
   - Tutorials for proper game saving

### 5.4 Logging System
- **Log Levels**: Debug, Info, Warning, Error, Critical
- **Log Storage**: In-memory with optional localStorage persistence
- **Log Format**: Timestamp, level, context, message, data
- **Log Rotation**: Maximum size limit with FIFO disposal
- **Developer Console**: Filtered log view for debugging
- **Export Functionality**: Download logs for support

---

## 6. Testing Plan

### 6.1 Testing Strategies
1. **Unit Testing**:
   - Core game mechanics and calculations
   - Resource generation formulas
   - Event trigger conditions
   - Requirement validation logic
   - State transitions

2. **Integration Testing**:
   - Interaction between game systems
   - Resource flow across components
   - Event chains and consequences
   - UI updates based on state changes
   - Save/load cycle integrity

3. **Playthrough Testing**:
   - Complete game progression paths
   - Multiple decision branches
   - Long-term game balance
   - Achievement unlocking
   - Different playing styles

4. **Performance Testing**:
   - Idle calculation efficiency
   - UI responsiveness under load
   - Memory usage over time
   - Long play session stability
   - Multiple device compatibility

### 6.2 Test Cases

1. **Resource Generation**:
   - Verify correct idle resource generation
   - Test resource caps and overflow handling
   - Validate resource generation multipliers
   - Check for resource leaks or duplication
   - Verify correct application of modifiers

2. **Game Progression**:
   - Test unlocking of new features
   - Verify game difficulty scaling
   - Validate win conditions
   - Test progression blockers and gates
   - Verify progression indicators

3. **Event System**:
   - Test event triggering conditions
   - Verify event consequences
   - Test event chaining
   - Validate time-sensitive events
   - Check event frequency distribution

4. **UI and Interaction**:
   - Verify all UI elements render correctly
   - Test all interactive elements respond to input
   - Validate accessibility features
   - Check responsive layout on different screen sizes
   - Test keyboard shortcuts and navigation

5. **Save System**:
   - Verify save integrity across sessions
   - Test import/export functionality
   - Validate version migration
   - Test recovery from corrupted saves
   - Check storage limit handling

### 6.3 Testing Environment
- **Browser Coverage**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop, tablet, mobile
- **Performance Profiles**: Low-end, mid-range, high-end devices
- **Network Conditions**: Offline, slow connection, unstable connection
- **User Scenarios**: New player, returning player, advanced player

### 6.4 Tools and Frameworks
- **Jest**: For unit and integration testing
- **Testing Library**: For component testing
- **Cypress**: For end-to-end testing
- **Lighthouse**: For performance and accessibility testing
- **Chrome DevTools**: For performance profiling
- **WebPageTest**: For loading and rendering analysis
- **A/B Testing Framework**: For testing different game balance settings

### 6.5 Quality Assurance Process
1. **Automated Testing**:
   - CI/CD pipeline integration
   - Pre-commit hooks for basic validation
   - Nightly full test suite runs
   - Coverage reporting

2. **Manual Testing**:
   - Structured test plans for major features
   - Exploratory testing sessions
   - Play testing with varied play styles
   - Balance testing with simulated progression

3. **Beta Testing**:
   - Closed beta with NDA
   - Open beta for wider feedback
   - Telemetry and analytics integration
   - Feedback collection and categorization

4. **Post-Release Monitoring**:
   - Analytics for unexpected behaviors
   - Error tracking and prioritization
   - Performance monitoring
   - User feedback analysis

---

## 7. Implementation Plan

### 7.1 Milestones
1. **Prototype (2 Weeks)**:
   - Core resource generation system
   - Basic structure system
   - Simple UI framework
   - Resource visualization
   - Save/load functionality

2. **Alpha Version (1 Month)**:
   - Complete resource system with all resource types
   - All basic structures implemented
   - Worker assignment system
   - Simple opposition system
   - Basic event system framework
   - Core game loop balancing

3. **Beta Version (2 Months)**:
   - All game systems functional
   - Complete progression path
   - Full event system with core events
   - Basic tutorials and help system
   - UI polish and consistency
   - Performance optimization
   - Initial balance testing

4. **Release Version (3 Months)**:
   - Polished UI with transitions and animations
   - Complete event library (minimum 50 events)
   - Balanced progression curve
   - Achievement system with rewards
   - Comprehensive help documentation
   - Accessibility features
   - Performance optimizations
   - Cross-browser testing

### 7.2 Resource Allocation
1. **Development Team**:
   - 1 Lead Developer/Architect
   - 1 Front-end Developer (UI focus)
   - 1 Game Systems Developer (mechanics focus)

2. **Content Creation**:
   - 1 Game Designer/Writer (events, flavor text)
   - 1 Artist (UI elements, icons, visual progression)

3. **Quality Assurance**:
   - 1 QA Tester (part-time)
   - Community play-testers for balance and progression

4. **Post-Launch Support**:
   - 1 Developer for bug fixes and updates
   - 1 Designer for content additions

### 7.3 Development Workflow
1. **Sprint Structure**:
   - 2-week sprints
   - Sprint planning at start
   - Daily stand-ups
   - Sprint review and retrospective

2. **Version Control**:
   - Git repository
   - Feature branch workflow
   - Pull request reviews
   - Semantic versioning

3. **Documentation**:
   - JSDoc for code documentation
   - Markdown for design documents
   - Wiki for game design decisions
   - Change logs for updates

4. **Communication**:
   - Project management tool (e.g., Jira, Trello)
   - Team chat platform
   - Weekly team meetings
   - Shared design documents

### 7.4 Risk Management
1. **Scope Creep**:
   - Maintain clear feature prioritization
   - Use MoSCoW method (Must, Should, Could, Won't)
   - Regular scope reviews
   - MVP approach for initial release

2. **Technical Challenges**:
   - Early prototyping of complex systems
   - Technical spikes for unknown areas
   - Backup approaches for risky features
   - External expert consultation when needed

3. **Balance Issues**:
   - Implement analytics to track player progression
   - Create tuning parameters for easy adjustment
   - Regular balance testing sessions
   - Beta testing feedback loops

4. **Resource Constraints**:
   - Clear prioritization of features
   - Scalable architecture that starts simple
   - Reusable components and systems
   - Focus on core experience first

5. **Technical Debt**:
   - Regular refactoring sessions
   - Code review process
   - Maintain comprehensive test coverage
   - Documentation of complex systems and algorithms

---

## 8. Game Content Details

### 8.1 Resources
1. **Primary Resource**: 
   - **Collective Bargaining Power**: The core resource representing the movement's ability to negotiate and demand change

2. **Secondary Resources**:
   - **Solidarity**: Represents unity among workers and community members
   - **Community Trust**: Represents the community's faith in the movement
   - **Direct Action Points**: Used for confrontational tactics
   - **Education Level**: Impacts the effectiveness of organizing attempts
   - **Material Resources**: Physical goods and supplies for sustaining the movement

3. **Hidden Resources**:
   - **Opposition Awareness**: How much attention authorities are paying (not directly visible to player)
   - **Public Opinion**: General sentiment toward the movement (revealed through events)
   - **Infiltration Level**: Degree to which the movement has been compromised (revealed through events)

### 8.2 Structures
1. **Early Game**:
   - **Community Center**: Gathering place that generates solidarity
   - **Union Office**: Generates collective bargaining power
   - **Alternative Media Outlet**: Counters corporate propaganda
   - **Mutual Aid Network**: Provides material resources
   - **Study Group**: Increases education level

2. **Mid Game**:
   - **Worker Cooperative**: Self-managed workplace that generates resources
   - **Neighborhood Assembly**: Democratic decision-making body
   - **People's Kitchen**: Provides food and builds community
   - **Free School**: Higher-level education programming
   - **Legal Aid Collective**: Helps with legal opposition

3. **Late Game**:
   - **General Strike Headquarters**: Coordinates mass action
   - **Revolutionary Council**: Decision-making body for the movement
   - **Autonomous Zone**: Self-governed area free from state control
   - **People's Defense Committee**: Protects the movement from repression
   - **Alternative Economic System**: Replaces capitalist structures

### 8.3 Activities/Tasks
1. **Early Game**:
   - **Distribute Flyers**: Spreads awareness
   - **Host Community Meetings**: Builds solidarity
   - **Workplace Organizing**: Identifies labor issues
   - **Mutual Aid Projects**: Addresses community needs
   - **Educational Workshops**: Increases education level

2. **Mid Game**:
   - **Coordinate Strike Actions**: Disrupts capitalist production
   - **Establish Worker Cooperatives**: Creates alternative workplaces
   - **Build Alternative Institutions**: Creates parallel power structures
   - **Counter Corporate Propaganda**: Combats misinformation
   - **Community Defense Training**: Prepares for opposition

3. **Late Game**:
   - **General Strike Organization**: Prepares for mass work stoppage
   - **Factory Occupations**: Workers take control of workplaces
   - **Critical Infrastructure Defense**: Protects key movement resources
   - **Establish People's Governance**: Creates new decision-making bodies
   - **System Replacement Projects**: Builds alternatives to capitalism

### 8.4 Opposition Forces
1. **Early Game**:
   - **Corporate Media Smears**: Reduces public opinion
   - **Manager Intimidation**: Targets individual workers
   - **Infiltration Attempts**: Plants informants in the movement

2. **Mid Game**:
   - **Police Harassment**: Disrupts organizing activities
   - **Legal Challenges**: Ties up resources in court
   - **Corporate Union-Busting**: Attacks workplace organizing
   - **Surveillance**: Monitors movement activities

3. **Late Game**:
   - **Police Repression**: Violent suppression of activities
   - **State Violence**: Military or militarized police response
   - **Corporate Sabotage**: Attacks on alternative institutions
   - **Military Intervention**: Highest level of state response

### 8.5 Moral Dilemmas
1. **Tactical Choices**:
   - **Nonviolent vs. Property Destruction**: Effectiveness versus public opinion
   - **Broad Appeal vs. Ideological Purity**: Reach versus coherence
   - **Compromise vs. Holding Firm**: Short-term gains versus long-term vision

2. **Resource Allocation**:
   - **Immediate Relief vs. Long-term Building**: Helping now versus future capacity
   - **Defense vs. Offense**: Protecting gains versus expanding
   - **Local Focus vs. Solidarity Actions**: Depth versus breadth

3. **Political Decisions**:
   - **Coalition Building with Liberals**: Expand support versus ideological dilution
   - **Engagement with Electoral Politics**: Work within system versus revolution
   - **Handling Internal Disagreements**: Unity versus debate

### 8.6 Educational Content
1. **Historical References**:
   - Spanish Revolution
   - IWW (Industrial Workers of the World)
   - Paris Commune
   - Zapatista Movement
   - Various general strikes

2. **Theoretical Concepts**:
   - Mutual Aid
   - Direct Democracy
   - Workers' Self-Management
   - General Strike Theory
   - Dual Power

3. **Integration Methods**:
   - Event text with historical parallels
   - Building descriptions with theoretical context
   - Encyclopedia entries unlocked with progress
   - Loading screen tips with factual information
   - Achievement descriptions with real-world connections

---

## 9. Appendices

### 9.1 Glossary of Terms
- **Anarcho-Syndicalism**: A theory of anarchism that views revolutionary industrial unionism or syndicalism as a method for workers to gain control of the economy and thus control of society
- **Collective Bargaining**: Negotiation between organized workers and employers to determine wages, benefits, and working conditions
- **Direct Action**: Political action taken outside of the established political structure
- **Dual Power**: The creation of alternative institutions alongside existing capitalist ones
- **General Strike**: A strike of all or most workers in a community or nation
- **Mutual Aid**: Voluntary reciprocal exchange of resources and services
- **Solidarity**: Unity or agreement of feeling or action, especially among individuals with a common interest
- **Syndicates**: Worker-controlled labor associations or unions
- **Workers' Self-Management**: A form of organizational management based on self-directed work processes

### 9.2 Art Style Guide
- **Visual Style**: Clean, minimalist vector graphics
- **Color Palette**: Bold, high-contrast colors with political significance
- **Primary Colors**: Red (#E63946), Black (#1D3557), Gold (#FFD166)
- **Secondary Colors**: White (#F1FAEE), Blue (#457B9D), Green (#2A9D8F)
- **Typography**: 
  - Headers: Montserrat Bold
  - Body: Open Sans
  - Accents: Bebas Neue
- **Iconography**: Simple, recognizable symbols with consistent stroke weight
- **UI Elements**: Flat design with minimal shadows and clear borders

### 9.3 References
- **Game Design Inspiration**:
  - Cookie Clicker (for central upgrade mechanics)
  - Melvor Idle (for depth of systems)
  - Rusty's Retirement (for visual progression)
  - Universal Paperclips (for narrative progression)
  
- **Political References**:
  - "Anarcho-Syndicalism: Theory and Practice" by Rudolf Rocker
  - "The Conquest of Bread" by Peter Kropotkin
  - "Living My Life" by Emma Goldman
  - "Homage to Catalonia" by George Orwell

### 9.4 Future Development Roadmap
1. **Phase 1 (Post-Launch)**: 
   - Bug fixes and balance adjustments
   - Additional events and buildings
   - Quality of life improvements

2. **Phase 2 (3 Months Post-Launch)**:
   - New game mode: Historical Scenarios
   - Advanced strategy options
   - Visual improvements and animations

3. **Phase 3 (6 Months Post-Launch)**:
   - Mobile version
   - Community-contributed events
   - Extended late-game content

4. **Phase 4 (1 Year Post-Launch)**:
   - New game mode: International Solidarity
   - Expanded narrative elements
   - Additional victory paths

### 9.5 Development Tools
- **IDE**: Visual Studio Code with ESLint, Prettier
- **Design**: Figma for UI mockups
- **Asset Creation**: Adobe Illustrator for vector graphics
- **Project Management**: Trello or GitHub Projects
- **Documentation**: GitBook or GitHub Wiki
- **Communication**: Discord for team and community

---

**Document Author**: Technical Documentation Team  
**Last Updated**: February 24, 2025  
**Version**: 1.0