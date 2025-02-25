import React from 'react';
import { Structure } from '../../models/structure';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './BuildingItem.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { formatNumber } from '../../utils/formatters';

/**
 * Get color for worker efficiency visualization
 * @param ratio Staffing ratio (0-1)
 * @returns CSS color string
 */
const getEfficiencyColor = (ratio: number): string => {
  if (ratio <= 0.3) {
    return 'var(--color-danger)'; // Under-staffed (red)
  } else if (ratio <= 0.7) {
    return 'var(--color-warning)'; // Moderately staffed (yellow/orange)
  } else if (ratio <= 0.9) {
    return 'var(--color-success)'; // Optimally staffed (green)
  } else {
    return 'var(--color-info)'; // Fully staffed (blue)
  }
};

interface BuildingItemProps {
  building: Structure;
  onPurchase: () => void;
  onWorkerChange: (delta: number) => void;
  canAfford: boolean;
}

/**
 * Individual building item component that displays building info and controls
 */
const BuildingItem: React.FC<BuildingItemProps> = ({ 
  building, 
  onPurchase, 
  onWorkerChange,
  canAfford 
}) => {
  const resources = useSelector((state: RootState) => state.resources);
  
  const isPurchased = building.level > 0;
  const isMaxLevel = building.level >= building.maxLevel;
  
  // Get resource costs and format them for display
  const getCostDisplay = () => {
    return Object.entries(building.cost).map(([resourceId, amount]) => {
      const resource = resources[resourceId];
      const resourceName = resource ? resource.name : resourceId;
      const formattedAmount = formatNumber(amount);
      
      const hasEnough = resource && resource.amount >= amount;
      
      return (
        <div 
          key={resourceId} 
          className={`${styles.costItem} ${hasEnough ? styles.canAfford : styles.cannotAfford}`}
        >
          {formattedAmount} {resourceName}
        </div>
      );
    });
  };
  
  // Get production details for display
  const getProductionDisplay = () => {
    return Object.entries(building.production).map(([resourceId, amount]) => {
      const resource = resources[resourceId];
      const resourceName = resource ? resource.name : resourceId;
      const formattedAmount = formatNumber(amount);
      
      return (
        <div key={resourceId} className={styles.productionItem}>
          +{formattedAmount} {resourceName}/s
        </div>
      );
    });
  };
  
  return (
    <Card className={styles.buildingItem}>
      <div className={styles.header}>
        <h3 className={styles.name}>{building.name}</h3>
        <div className={styles.level}>Level {building.level}/{building.maxLevel}</div>
      </div>
      
      <p className={styles.description}>{building.description}</p>
      
      <div className={styles.details}>
        <div className={styles.production}>
          <h4>Production:</h4>
          {getProductionDisplay()}
        </div>
        
        {!isMaxLevel && (
          <div className={styles.cost}>
            <h4>{isPurchased ? 'Upgrade Cost:' : 'Cost:'}</h4>
            {getCostDisplay()}
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        {!isMaxLevel && (
          <Button 
            onClick={onPurchase} 
            disabled={!canAfford}
            variant={isPurchased ? 'secondary' : 'primary'}
          >
            {isPurchased ? 'Upgrade' : 'Purchase'}
          </Button>
        )}
        
        {isPurchased && (
          <div className={styles.workers}>
            <h4>Organizers: {building.workers}/{building.maxWorkers}</h4>
            <div className={styles.workerControls}>
              <Button 
                onClick={() => onWorkerChange(-1)} 
                disabled={building.workers <= 0}
                variant="secondary"
                size="small"
              >
                -
              </Button>
              <Button 
                onClick={() => onWorkerChange(1)} 
                disabled={building.workers >= building.maxWorkers}
                variant="secondary"
                size="small"
              >
                +
              </Button>
            </div>
            
            {building.workers > 0 && (
              <div className={styles.efficiency}>
                <div 
                  className={styles.efficiencyBar} 
                  style={{ 
                    width: `${Math.min(100, (building.workers / building.maxWorkers) * 100)}%`,
                    backgroundColor: getEfficiencyColor(building.workers / building.maxWorkers)
                  }}
                />
                <span className={styles.efficiencyLabel}>
                  Staffing: {Math.round((building.workers / building.maxWorkers) * 100)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BuildingItem;