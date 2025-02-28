import React from 'react';
import { render } from '@testing-library/react';
import Icon, { IconName } from '../Icon';

describe('Icon Component', () => {
  test('renders with default props', () => {
    render(<Icon name="info" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('game-icon');
    expect(svgElement).toHaveAttribute('width', '1em');
    expect(svgElement).toHaveAttribute('height', '1em');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('renders with custom size as number', () => {
    render(<Icon name="info" size={24} />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '24px');
    expect(svgElement).toHaveAttribute('height', '24px');
  });

  test('renders with custom size as string', () => {
    render(<Icon name="info" size="2rem" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '2rem');
    expect(svgElement).toHaveAttribute('height', '2rem');
  });

  test('renders with custom color', () => {
    render(<Icon name="info" color="#ff0000" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('fill', '#ff0000');
  });

  test('renders with custom class name', () => {
    render(<Icon name="info" className="custom-icon" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-icon');
  });

  test('renders with proper accessibility attributes when aria provided', () => {
    render(<Icon name="info" aria="Information icon" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Information icon');
    expect(svgElement).toHaveAttribute('role', 'img');
    // When aria is provided, aria-hidden is set to false rather than being removed
    expect(svgElement).toHaveAttribute('aria-hidden', 'false');
  });

  test('renders with aria-hidden when no aria provided', () => {
    render(<Icon name="info" />);

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-hidden', 'true');
    expect(svgElement).not.toHaveAttribute('role');
  });

  // Test a few different icon types to ensure paths are correctly rendered
  const iconTypes: IconName[] = ['info', 'success', 'building', 'resource', 'play'];

  test.each(iconTypes)('renders %s icon with correct path', (iconName) => {
    render(<Icon name={iconName} />);

    const pathElement = document.querySelector('path');
    expect(pathElement).toBeInTheDocument();
  });
});
