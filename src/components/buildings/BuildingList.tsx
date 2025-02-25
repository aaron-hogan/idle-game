import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { addStructure } from '../../state/structuresSlice';
import { createInitialBuildings } from '../../systems/buildingManager';
import withErrorBoundary from '../error/withErrorBoundary';

/**
 * Displays a list of all available buildings - simplified version for debugging
 */
const BuildingList: React.FC = () => {
  const dispatch = useDispatch();
  
  // Safely access structures with defensive checks
  const structuresState = useSelector((state: RootState) => {
    if (!state || typeof state !== 'object') {
      return {};
    }
    
    if (!('structures' in state)) {
      return {};
    }
    
    const structures = state.structures;
    
    if (typeof structures !== 'object' || structures === null) {
      return {};
    }
    
    return structures;
  });
  
  // Add state to track initialization attempts
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize buildings if none exist
  useEffect(() => {
    try {
      // Only try to initialize once
      if (hasAttemptedInit) {
        return;
      }
      
      // If structures is empty or doesn't have the expected structure
      if (!structuresState || Object.keys(structuresState).length === 0) {
        const initialBuildings = createInitialBuildings();
        
        initialBuildings.forEach(building => {
          try {
            dispatch(addStructure(building));
          } catch (e) {
            console.error("Error dispatching add structure:", e);
            setError(e instanceof Error ? e : new Error(String(e)));
          }
        });
      }
      
      setHasAttemptedInit(true);
    } catch (error) {
      console.error("Error initializing buildings:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setHasAttemptedInit(true);
    }
  }, [dispatch, structuresState, hasAttemptedInit]);
  
  // Render a simplified list of buildings
  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #363030', 
      borderRadius: '4px', 
      margin: '1rem 0',
      backgroundColor: '#27252D',
      color: '#B09E9E',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)'
    }}>
      <h2 style={{ color: '#C4A3FF' }}>Buildings</h2>
      <p>This is a simplified buildings view for debugging.</p>
      
      {/* Show error message if there was an error */}
      {error && (
        <div style={{ 
          padding: '0.5rem', 
          backgroundColor: 'rgba(217, 73, 73, 0.2)', 
          color: '#FF6B6B',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #D94949'
        }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}
      
      {/* Debug information */}
      <div style={{ 
        backgroundColor: '#262020', 
        padding: '0.5rem', 
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        border: '1px solid #363030'
      }}>
        <p>Initialization attempted: {hasAttemptedInit ? 'Yes' : 'No'}</p>
        <p>Structures state type: {typeof structuresState}</p>
        <p>Is structures object: {structuresState && typeof structuresState === 'object' ? 'Yes' : 'No'}</p>
        <p>Structures keys: {structuresState && typeof structuresState === 'object' ? 
          JSON.stringify(Object.keys(structuresState)) : 'None'}</p>
      </div>
      
      {Object.keys(structuresState).length === 0 ? (
        <div>
          <p>No buildings available yet.</p>
          <button 
            onClick={() => {
              try {
                const initialBuildings = createInitialBuildings();
                // Initialize buildings
                initialBuildings.forEach(building => {
                  dispatch(addStructure(building));
                });
              } catch (e) {
                console.error("Error in manual init:", e);
                setError(e instanceof Error ? e : new Error(String(e)));
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#7DCC75',
              color: '#15131A',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Initialize Buildings
          </button>
        </div>
      ) : (
        <div>
          <p>Buildings available: {Object.keys(structuresState).length}</p>
          <ul>
            {Object.entries(structuresState).map(([id, structure]) => {
              if (!structure || typeof structure !== 'object') {
                return <li key={id}>Invalid structure: {String(structure)}</li>;
              }
              
              // Access structure properties safely
              const name = 'name' in structure ? structure.name : 'Unknown';
              const level = 'level' in structure ? structure.level : 0;
              const unlocked = 'unlocked' in structure ? structure.unlocked : false;
              
              return (
                <li key={id} style={{ 
                  margin: '0.5rem 0',
                  padding: '0.5rem',
                  backgroundColor: unlocked ? '#322e36' : '#262020',
                  borderRadius: '4px',
                  border: '1px solid #363030'
                }}>
                  <strong style={{ color: '#C4A3FF' }}>{name}</strong> 
                  (Level: {level}) - 
                  <span style={{ color: unlocked ? '#7DCC75' : '#9789AC' }}>
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(BuildingList, {
  componentName: 'BuildingList',
  onError: (error, errorInfo) => {
    console.error('Error in BuildingList component:', error, errorInfo);
  }
});