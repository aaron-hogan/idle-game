import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('game-button');
    expect(button).toHaveClass('game-button-primary');
    expect(button).toHaveClass('game-button-medium');
    expect(button).not.toHaveClass('game-button-full-width');
  });

  test('renders button with custom variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('game-button-secondary');
  });

  test('renders button with custom size', () => {
    render(<Button size="large">Large Button</Button>);

    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('game-button-large');
  });

  test('renders full width button', () => {
    render(<Button fullWidth>Full Width Button</Button>);

    const button = screen.getByRole('button', { name: /full width button/i });
    expect(button).toHaveClass('game-button-full-width');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);

    const button = screen.getByRole('button', { name: /custom class button/i });
    expect(button).toHaveClass('custom-class');
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('game-button-disabled');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole('button', { name: /clickable button/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick handler when disabled button is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
