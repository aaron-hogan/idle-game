# UI Redesign Wireframe

## Main Game Page

```
+-----------------------------------------------------------------------+
|                                                                       |
| GAME TIMER                                              MENU BUTTON   | <- Control Bar (existing)
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| PROGRESS: [====================50%==============] Game Stage: Early   | <- New Progress Bar (thin)
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| 🌟 500   🔨 120/200   🪵 45   💡 10   💰 2500   🔋 80/100   🌾 35    | <- New Resource Bar
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                                                                 |  |
|  |  MAIN CLICKABLE MILESTONE                                  75%  |  |
|  |                                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                  EXPANDABLE RESOURCE GENERATORS                 |  |
|  |                                                                 |  |
|  |                 (More buttons appear as unlocked)               |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| [MAIN] [UPGRADES] [PROGRESSION] [SETTINGS]                           | <- Navigation Tabs
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                        SHOW DEBUG DATA                                |
|                                                                       |
+-----------------------------------------------------------------------+
```

## Upgrades Page

```
+-----------------------------------------------------------------------+
|                                                                       |
| GAME TIMER                                              MENU BUTTON   |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| PROGRESS: [====================50%==============] Game Stage: Early   |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| 🌟 500   🔨 120/200   🪵 45   💡 10   💰 2500   🔋 80/100   🌾 35    |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                      UPGRADE PANEL CONTENT                      |  |
|  |                                                                 |  |
|  |                   (List of available upgrades)                  |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| [MAIN] [UPGRADES] [PROGRESSION] [SETTINGS]                           |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                        SHOW DEBUG DATA                                |
|                                                                       |
+-----------------------------------------------------------------------+
```

## Progression Page

```
+-----------------------------------------------------------------------+
|                                                                       |
| GAME TIMER                                              MENU BUTTON   |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| PROGRESS: [====================50%==============] Game Stage: Early   |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| 🌟 500   🔨 120/200   🪵 45   💡 10   💰 2500   🔋 80/100   🌾 35    |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                   PROGRESSION TRACKER CONTENT                   |  |
|  |                                                                 |  |
|  |             (Milestones, achievements, statistics)              |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  |                                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
| [MAIN] [UPGRADES] [PROGRESSION] [SETTINGS]                           |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                        SHOW DEBUG DATA                                |
|                                                                       |
+-----------------------------------------------------------------------+
```

## Mobile View - Main Game

```
+-------------------------------+
|                               |
| GAME TIMER          MENU     | <- Control Bar
|                               |
+-------------------------------+
|                               |
| [==========50%==========]     | <- Progress Bar
|                               |
+-------------------------------+
|                               |
| 🌟 500  🔨 120  💰 2500      | <- Resource Bar
| 🪵 45   💡 10   🔋 80         | <- Resource Bar (wraps)
|                               |
+-------------------------------+
|                               |
|  +-------------------------+  |
|  |                         |  |
|  | MAIN MILESTONE      75% |  |
|  |                         |  |
|  +-------------------------+  |
|                               |
|  +-------------------------+  |
|  |                         |  |
|  |                         |  |
|  |    RESOURCE GENERATORS  |  |
|  |                         |  |
|  | (Scrollable if needed)  |  |
|  |                         |  |
|  +-------------------------+  |
|                               |
+-------------------------------+
|                               |
| MAIN UPGRADES PROGRESS SETT  | <- Nav Tabs
|                               |
+-------------------------------+
|                               |
|       SHOW DEBUG DATA         |
|                               |
+-------------------------------+
```

## Key Changes

1. **Top Area (Common across all pages)**
   - Control Bar (existing)
   - Progress Bar (new, thin)
   - Resource Bar (new, compact)

2. **Main Game Page**
   - Main Clickable Milestone (remains at top)
   - Expandable area for resource generators
   - More buttons/generators appear as they are unlocked (like Cookie Clicker)

3. **Tab Navigation**
   - Main (default view with clickable resource generators)
   - Upgrades (moved to separate page)
   - Progression (moved to separate page)
   - Settings (new page for game settings)

4. **Resource Generators**
   - Dynamic area that expands as new generators are unlocked
   - Can be scrollable if many generators are available
   - Each generator could have its own click interaction and progress display

This redesign creates a more scalable interface that can accommodate many resource generators as they unlock throughout gameplay, while keeping the top resource bar and progress indicator consistent across all pages.