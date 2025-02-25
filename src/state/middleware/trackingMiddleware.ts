import { Middleware, AnyAction } from 'redux';
import { assignWorkers, changeWorkerCount } from '../structuresSlice';
import { 
  assignWorkersAction, 
  changeWorkerCountAction
} from '../actions/workerActions';
import { RootState } from '../store';

// Define type for trackable actions
interface TrackablePayload {
  track: boolean;
  id: string;
  workers?: number;
  delta?: number;
}

interface TrackableAction extends AnyAction {
  payload: TrackablePayload;
}

// Type guard to check if an action is trackable
function isTrackableAction(action: AnyAction): action is TrackableAction {
  return (
    action.payload !== undefined && 
    action.payload !== null &&
    typeof action.payload === 'object' &&
    'track' in action.payload &&
    'id' in action.payload
  );
}

/**
 * Middleware to handle tracking events without double dispatching
 * When an action has a 'track' flag, it will automatically dispatch a tracking event
 */
export const trackingMiddleware: Middleware<{}, RootState> = 
  ({ dispatch }) => (next) => (action: unknown) => {
    // Cast the unknown action to AnyAction for our internal use
    const typedAction = action as AnyAction;
    // First, pass the action to the next middleware or reducer
    const result = next(action);
    
    // Then check if we need to dispatch a tracking event
    if (isTrackableAction(typedAction) && typedAction.payload.track) {
      // Worker assignment tracking
      if (assignWorkers.match(typedAction)) {
        dispatch(assignWorkersAction({
          buildingId: typedAction.payload.id,
          workers: typedAction.payload.workers || 0
        }));
      }
      
      // Worker count change tracking
      else if (changeWorkerCount.match(typedAction)) {
        dispatch(changeWorkerCountAction({
          buildingId: typedAction.payload.id,
          delta: typedAction.payload.delta || 0
        }));
      }
    }
    
    return result;
  };