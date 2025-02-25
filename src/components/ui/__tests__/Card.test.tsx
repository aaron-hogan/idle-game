import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  test('renders with default props', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(document.querySelector('.game-card')).toBeInTheDocument();
    expect(document.querySelector('.game-card-header')).not.toBeInTheDocument();
    expect(document.querySelector('.game-card-footer')).not.toBeInTheDocument();
  });
  
  test('renders with title and subtitle', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(document.querySelector('.game-card-header')).toBeInTheDocument();
  });
  
  test('renders with footer', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(document.querySelector('.game-card-footer')).toBeInTheDocument();
  });
  
  test('applies custom class names', () => {
    render(
      <Card 
        className="custom-card" 
        headerClassName="custom-header"
        bodyClassName="custom-body"
        footerClassName="custom-footer"
        title="Title"
        footer={<span>Footer</span>}
      >
        <p>Content</p>
      </Card>
    );
    
    expect(document.querySelector('.game-card.custom-card')).toBeInTheDocument();
    expect(document.querySelector('.game-card-header.custom-header')).toBeInTheDocument();
    expect(document.querySelector('.game-card-body.custom-body')).toBeInTheDocument();
    expect(document.querySelector('.game-card-footer.custom-footer')).toBeInTheDocument();
  });
});