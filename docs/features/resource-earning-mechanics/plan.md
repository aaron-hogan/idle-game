# Enhanced Resource Earning Mechanics - Design Plan

## Concept Overview
Enhance the core resource earning mechanics by implementing:
1. Production rate thresholds for milestone eligibility
2. Default net-neutral resource balance
3. Manual clicking mechanics for initial resource generation
4. Automation rewards for progression

## Current System Analysis

### Strengths
- Basic resource generation system is functioning
- Resource accumulation connects to milestone progress
- Debug panel allows tracking of resource generation

### Limitations
- Too passive - resources accumulate automatically without player agency
- Lacks meaningful interaction in early game
- No strategic depth in resource management
- Progression feels arbitrary rather than earned

## Proposed Mechanics

### 1. Production Rate Thresholds for Milestones
- Milestone eligibility tied to production rate (e.g., +0.2/s) rather than just total amount
- Players must optimize production before gaining progress toward milestones
- Creates a clear progression goal beyond simple accumulation
- Adds strategic depth to resource allocation decisions

### 2. Net-Neutral Default Resources
- Resources start with 0 net gain (or slight decay)
- Forces player to make active choices to increase production
- Creates natural progression gates without arbitrary barriers
- Prevents idle accumulation without player decisions

### 3. Manual Clicking for Initial Resources
- Early game requires clicking resource icons to generate resources
- Each click produces a small amount of the resource
- Creates an active gameplay loop in early stages
- Gives players a sense of direct contribution to movement building

### 4. Automation as Progression Reward
- First meaningful milestone rewards include basic automation
- Clicking becomes less necessary as player progresses
- Advanced automation becomes available through strategic choices
- Provides a sense of progression from manual labor to organized systemic change

## Implementation Considerations

### Technical Requirements
- Click detection and resource generation system
- Production rate calculation and tracking
- Milestone requirement system enhancement
- Automation system for resource generation

### UI/UX Requirements
- Clickable resource elements with visual feedback
- Clear display of production rates and thresholds
- Visual indicators for milestone eligibility
- Intuitive automation interface

### Balance Considerations
- Click value to make early game engaging but not tedious
- Production thresholds appropriate to game stage
- Automation power balanced against manual effort
- Decay/consumption rates to prevent resource oversaturation

## Thematic Integration
This system better reflects anti-capitalist themes by:
- Emphasizing collective action (clicking) leading to systemic change (automation)
- Modeling the transition from individual activism to organized movements
- Creating a tangible sense of building momentum through consistent effort
- Demonstrating how initial organizing leads to self-sustaining movements

## Development Phases

### Phase 1: Core Clicking Mechanics
- Implement clickable resource components
- Add click-to-earn functionality
- Create visual feedback for clicks
- Adjust base resource generation to net-neutral

### Phase 2: Production Rate Tracking
- Enhance resource tracking to emphasize production rates
- Modify milestone system to check rate thresholds
- Update debug panel to show production requirements
- Create UI indicators for milestone eligibility

### Phase 3: Automation Implementation
- Design tiered automation system
- Implement automation rewards for milestones
- Create automation management interface
- Balance automation benefits against costs

### Phase 4: Polish and Balance
- Tune click values and production thresholds
- Add animations and feedback for clarity
- Create tutorials for new mechanics
- Test progression pacing and adjust as needed

## Expected Outcomes
- Increased player engagement in early game
- More meaningful sense of progression
- Deeper strategic choices around resource allocation
- Better alignment with anti-capitalist themes of collective action and organizing