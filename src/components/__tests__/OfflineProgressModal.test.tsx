import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OfflineProgressModal from '../OfflineProgressModal';
import { formatTime } from '../../utils/timeUtils';

// Mock formatTime to avoid having to mock Date.now
jest.mock('../../utils/timeUtils', () => ({
  formatTime: jest.fn(seconds => `${seconds} seconds`),
}));

describe('OfflineProgressModal', () => {
  it('should render offline progress information', () => {
    const offlineTime = 3600; // 1 hour
    const resourceGains = [
      { id: 'cbp', name: 'Collective Bargaining Power', amount: 1200 },
      { id: 'solidarity', name: 'Solidarity', amount: 600 },
    ];
    
    const handleClose = jest.fn();
    
    render(
      <OfflineProgressModal
        isOpen={true}
        onClose={handleClose}
        offlineTime={offlineTime}
        resourceGains={resourceGains}
      />
    );
    
    // Check if main title is displayed
    expect(screen.getByText('While You Were Away')).toBeInTheDocument();
    
    // Check if time away is displayed with formatted time
    expect(formatTime).toHaveBeenCalledWith(offlineTime);
    expect(screen.getByText(/you were gone for/i)).toBeInTheDocument();
    expect(screen.getByText('3600 seconds')).toBeInTheDocument();
    
    // Check if resource gains are displayed
    expect(screen.getByText('Resources Generated:')).toBeInTheDocument();
    
    // Check each resource gain
    resourceGains.forEach(gain => {
      expect(screen.getByText(gain.name)).toBeInTheDocument();
      expect(screen.getByText(`+${gain.amount.toFixed(2)}`)).toBeInTheDocument();
    });
    
    // Check if close button is displayed
    expect(screen.getByText('Continue Revolution')).toBeInTheDocument();
  });
  
  it('should show message when no resources were generated', () => {
    render(
      <OfflineProgressModal
        isOpen={true}
        onClose={jest.fn()}
        offlineTime={1800}
        resourceGains={[]} // Empty array, no resources generated
      />
    );
    
    expect(screen.getByText('No resources were generated during your absence.')).toBeInTheDocument();
  });
  
  it('should call onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    
    render(
      <OfflineProgressModal
        isOpen={true}
        onClose={handleClose}
        offlineTime={1800}
        resourceGains={[]}
      />
    );
    
    // Click the close button
    fireEvent.click(screen.getByText('Continue Revolution'));
    
    // Check if handleClose was called
    expect(handleClose).toHaveBeenCalled();
  });
  
  it('should not render when isOpen is false', () => {
    render(
      <OfflineProgressModal
        isOpen={false}
        onClose={jest.fn()}
        offlineTime={1800}
        resourceGains={[]}
      />
    );
    
    // Modal content should not be in the document
    expect(screen.queryByText('While You Were Away')).not.toBeInTheDocument();
  });
});