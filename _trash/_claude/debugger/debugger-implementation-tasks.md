# Game Debugger Implementation Tasks

## Component Structure

1. Create new components:
   - `GameDebugger.tsx` - Main container component
   - `GameLoopDebugTab.tsx` - Tab for game loop metrics 
   - `TabSystem.tsx` - Reusable tab navigation system
   - `DebugMetricsPanel.tsx` - Reusable styled metric display

## Implementation Steps

### Step 1: Create Base Components

1. **Create GameDebugger Component**
   - Initialize with toggle functionality
   - Style for bottom-right positioning
   - Include tab navigation system

2. **Create Tab System**
   - Tab header/selection component
   - Tab content container
   - Active tab state management

3. **Create Game Loop Tab**
   - Port existing metrics from DebugPanel.tsx
   - Include Reset Scale and Sync Time buttons
   - Add FPS, time ratio, and time scale metrics
   - Add a toggle for tick rate adjustment

### Step 2: Integration

1. **Update App.tsx**
   - Remove existing DebugPanel component
   - Add new GameDebugger component

2. **Update debug/index.ts**
   - Remove iframe approach
   - Use React component rendering for debug panel

3. **Move Persistent Data**
   - Migrate any game-state access code from DebugPanel
   - Keep performance optimizations from existing implementation

### Step 3: Testing & Refinement

1. **Test Component**
   - Verify metrics are accurate 
   - Test toggle functionality
   - Ensure buttons work correctly

2. **Performance Check**
   - Ensure updates are throttled to avoid performance impact
   - Verify metrics capture doesn't affect game performance

3. **Optimize Rendering**
   - Use memoization where appropriate
   - Ensure panel updates don't cause whole app re-renders

## Specific Files to Modify

1. Create new files:
   - `/src/debug/GameDebugger.tsx`
   - `/src/debug/tabs/GameLoopDebugTab.tsx`
   - `/src/debug/components/TabSystem.tsx`

2. Modify existing files:
   - `/src/components/App.tsx` - Replace debug panels
   - `/src/debug/index.ts` - Update debug initialization
   - Move `/src/debug/DebugPanel.tsx` to deprecated folder

3. Update styles:
   - Add dedicated CSS for debug panel in `/src/styles/debug.css`