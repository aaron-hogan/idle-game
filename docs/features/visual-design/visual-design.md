# Unnamed Idle Game: Visual Design System

## Overview

The visual design system for "Unnamed Idle Game" creates a clean, minimal aesthetic with a light color scheme. This document describes the core design elements, components, and implementation details of our minimal visual language.

## Core Components

### Color System

Our color palette uses light backgrounds with blue accent colors:

```css
/* Main colors - minimal theme */
--color-primary: #4A90E2;
--color-secondary: #9E9E9E;
--color-accent: #5C6BC0;
--color-background: #F5F5F5;
--color-light: #E0E0E0;

/* Background colors */
--bg-color-main: #FFFFFF;
--bg-color-primary: #F5F5F5;
--bg-color-secondary: #EEEEEE;
--bg-color-accent: #E0E0E0;
--bg-color-highlight: #F0F7FF;

/* Text colors */
--text-color-primary: #212121;
--text-color-secondary: #616161;
--text-color-tertiary: #9E9E9E;
--text-color-inverse: #FFFFFF;
```

This color palette:
- Creates a clean, modern feel
- Provides good contrast for readability
- Uses blue accents for emphasis
- Maintains consistency across the application

### Typography System

Our typography system uses a single typeface for a clean, unified look:

1. **Roboto** (sans-serif): For all text elements including headers and body text

```css
/* Font families */
--font-family-heading: 'Roboto', sans-serif;
--font-family-body: 'Roboto', sans-serif;

/* Font sizes - minimal style */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-md: 1rem;
--font-size-lg: 1.25rem;
--font-size-xl: 1.5rem;
--font-size-xxl: 2rem;
--font-size-headline: 2rem;
```

Basic typography rules:
```css
body {
  font-family: var(--font-family-body);
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  font-weight: 500;
  line-height: 1.2;
}
```

### UI Components

#### Cards

Cards use a clean, minimal design with subtle shadows:

```css
.game-card {
  background-color: var(--bg-color-primary);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.game-card-header {
  position: relative;
  border-bottom: 1px solid var(--border-color);
}

.game-card-header::before {
  content: none;
}

.game-card-title {
  font-family: var(--font-family-heading);
  font-weight: 500;
}
```

#### Buttons

Buttons use a clean, modern design:

```css
.game-button {
  border-radius: 4px;
  font-weight: 500;
  font-family: var(--font-family-body);
  padding: 8px 16px;
  transition: background-color 0.2s ease;
}

.game-button-primary {
  background-color: var(--color-primary);
  color: white;
}
```

#### Headers

Clean, simple headers for sections:

```css
.game-header {
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-xl);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.game-subheader {
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
}
```

## Usage Guide

### Basic Component Implementation

To implement the minimal design in new components:

1. **Use CSS Variables**: Always reference color and typography variables
2. **Follow Typography Rules**: Maintain proper typographic hierarchy
3. **Consider Blue Accents**: Use blue accents for emphasis and interactive elements
4. **Maintain Minimalism**: Keep designs clean and uncluttered

### Example Component Usage

Card component with proper styling:

```tsx
import React from 'react';
import './Card.css';

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => (
  <div className="game-card">
    <div className="game-card-header">
      <h2 className="game-card-title">{title}</h2>
      {subtitle && <div className="game-card-subtitle">{subtitle}</div>}
    </div>
    <div className="game-card-body">
      {children}
    </div>
  </div>
);

export default Card;
```

Header component implementation:

```tsx
import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <div className="header-container">
    <h1 className="game-header">{title}</h1>
    {subtitle && <div className="game-subheader">{subtitle}</div>}
  </div>
);

export default Header;
```

## Integration with Other Systems

### Game State Reflection

- Use blue accents to highlight important state changes
- Employ typographic emphasis for key metrics
- Maintain consistent visual cues for game feedback

### Animation Guidelines

- Keep animations subtle and purposeful
- Use simple transitions like fades and slides
- Apply subtle hover effects for interactive elements

## Best Practices

1. **Maintain Contrast**: Ensure text remains readable against backgrounds
2. **Consistent Spacing**: Use spacing variables for consistent layout
3. **Responsive Design**: Ensure components work across device sizes
4. **Semantic HTML**: Use proper HTML elements for accessibility
5. **Strategic Color Use**: Reserve blue accents for important elements and interactive controls
6. **Typography Discipline**: Maintain the typographic hierarchy consistently

## Future Enhancements

1. **Light/Dark Mode**: Add support for theme toggle
2. **Micro-Interactions**: Subtle feedback animations on user interactions
3. **Advanced Animations**: Smooth transitions between game states
4. **Responsive Improvements**: Better handling of extreme screen sizes
5. **Accessibility Enhancements**: Better support for screen readers and keyboard navigation