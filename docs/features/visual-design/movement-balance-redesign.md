# Movement Balance UI Redesign

## Overview

The movement balance indicators (Collective Power and Corporate Oppression) have been redesigned to be more integrated with the game's header. This document outlines the changes and rationale.

## Changes Made

### UI Integration
- Moved the movement balance display from a standalone card to the top resource bar
- Utilized the existing Counter component to maintain UI consistency
- Enhanced the visual feedback with colored progress bars (green for power, red for oppression)

### Technical Implementation
- Added data attributes to resource containers for targeted styling
- Modified Counter component CSS to support the "oppression" icon type
- Adjusted progress bar colors to provide clear visual distinction between resources
- Ensured tooltips contain all necessary information about movement status

### Removed Components
- Removed the standalone PowerOppressionIndicator component
- Removed the dedicated container div that took up extra vertical space

## Rationale

The previous implementation had several issues:
1. It took up too much vertical space with a separate container
2. The large text descriptions were redundant and could be accessed via tooltips
3. The dual representation of the same resources (in both the top bar and the separate panel) was confusing

The new design achieves several improvements:
1. More efficient use of screen space
2. Clearer visual hierarchy with the most important resources visible at all times
3. Consistent use of UI components
4. Tooltips provide detailed information when needed

## Mobile Considerations

For mobile devices:
- Counter displays are reduced in size
- Rate indicators are hidden on very small screens
- The progress bars remain visible to maintain visual feedback

## Future Improvements

Potential future enhancements:
- Add visual effects when resources reach critical thresholds
- Consider a more compact combined indicator for very small screens
- Explore alternative visual metaphors for the power/oppression balance