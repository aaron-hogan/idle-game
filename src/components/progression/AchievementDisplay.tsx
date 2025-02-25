/**
 * Component for displaying achievements
 */
import React, { useState, memo, useMemo } from 'react';
import { Achievement, AchievementType } from '../../interfaces/progression';

/**
 * Mapping of achievement types to display names
 */
const achievementTypeNames: Record<AchievementType, string> = {
  [AchievementType.RESOURCE]: 'Resource',
  [AchievementType.STRATEGIC]: 'Strategic',
  [AchievementType.ETHICAL]: 'Ethical',
  [AchievementType.COMMUNITY]: 'Community',
  [AchievementType.RESISTANCE]: 'Resistance',
  [AchievementType.TIMED]: 'Timed',
  [AchievementType.SPECIAL]: 'Special'
};

/**
 * Props for the AchievementDisplay component
 */
interface AchievementDisplayProps {
  /** List of achievements to display */
  achievements: Achievement[];
  /** Class name for additional styling */
  className?: string;
}

/**
 * Component to display achievements with unlock status
 * Wrapped in memo to prevent unnecessary re-renders
 */
const AchievementDisplay: React.FC<AchievementDisplayProps> = memo(({ 
  achievements, 
  className = '' 
}) => {
  // State for achievement filter
  const [filter, setFilter] = useState<AchievementType | 'all'>('all');
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [showLocked, setShowLocked] = useState(true);
  
  // Filter and sort achievements based on selected criteria
  // Use useMemo to avoid re-filtering and re-sorting on every render
  const sortedAchievements = useMemo(() => {
    // First filter
    const filtered = achievements.filter(achievement => {
      // Filter by type
      if (filter !== 'all' && achievement.type !== filter) {
        return false;
      }
      
      // Filter by unlock status
      if (achievement.unlocked && !showUnlocked) {
        return false;
      }
      
      if (!achievement.unlocked && !showLocked) {
        return false;
      }
      
      return true;
    });
    
    // Then sort (unlocked first, then by type)
    return [...filtered].sort((a, b) => {
      // Unlocked first
      if (a.unlocked !== b.unlocked) {
        return a.unlocked ? -1 : 1;
      }
      
      // Then by type
      return a.type.localeCompare(b.type);
    });
  }, [achievements, filter, showUnlocked, showLocked]);
  
  // Get achievement counts
  // Use useMemo to avoid recalculating on every render
  const { unlockedCount, totalCount, progressPercentage } = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    const percentage = total > 0 
      ? Math.round((unlocked / total) * 100) 
      : 0;
      
    return { unlockedCount: unlocked, totalCount: total, progressPercentage: percentage };
  }, [achievements]);
  
  if (achievements.length === 0) {
    return (
      <div className={`achievement-display empty ${className}`}>
        <h3>Achievements</h3>
        <p>No achievements available yet.</p>
      </div>
    );
  }
  
  return (
    <div className={`achievement-display ${className}`}>
      <h3>Achievements ({unlockedCount}/{totalCount})</h3>
      
      <div className="achievement-progress">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="achievement-filters">
        <div className="filter-group">
          <label>Type:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as AchievementType | 'all')}
          >
            <option value="all">All Types</option>
            {Object.values(AchievementType).map(type => (
              <option key={type} value={type}>
                {achievementTypeNames[type]}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showUnlocked}
              onChange={() => setShowUnlocked(!showUnlocked)}
            />
            Show Unlocked
          </label>
          <label>
            <input
              type="checkbox"
              checked={showLocked}
              onChange={() => setShowLocked(!showLocked)}
            />
            Show Locked
          </label>
        </div>
      </div>
      
      <div className="achievement-list">
        {sortedAchievements.length === 0 ? (
          <p className="no-achievements">No achievements match the selected filters.</p>
        ) : (
          <ul className="achievement-grid">
            {sortedAchievements.map(achievement => (
              <li 
                key={achievement.id}
                className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {/* Icon placeholder - would be replaced with actual icons */}
                  <div className={`icon-placeholder ${achievement.type}`} />
                </div>
                
                <div className="achievement-content">
                  <h5>{achievement.unlocked || !achievement.hidden 
                    ? achievement.name 
                    : 'Hidden Achievement'}
                  </h5>
                  
                  <span className="achievement-type">
                    {achievementTypeNames[achievement.type]}
                  </span>
                  
                  <p className="achievement-description">
                    {achievement.unlocked || !achievement.hidden 
                      ? achievement.description 
                      : achievement.hint || 'Keep playing to unlock this achievement.'}
                  </p>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="achievement-unlocked-time">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleString()}
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.rewards && achievement.rewards.length > 0 && (
                    <div className="achievement-rewards">
                      <h6>Rewards:</h6>
                      <ul>
                        {achievement.rewards.map((reward, index) => (
                          <li key={index} className="reward-item">
                            {reward.type === 'resource' && (
                              <>
                                +{reward.value} {reward.target}
                              </>
                            )}
                            {reward.type === 'boost' && (
                              <>
                                +{Number(reward.value) * 100}% {reward.target} production
                              </>
                            )}
                            {reward.type === 'unlockFeature' && (
                              <>
                                Unlocked: {reward.target}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

// Add display name for debugging
AchievementDisplay.displayName = 'AchievementDisplay';

export default AchievementDisplay;