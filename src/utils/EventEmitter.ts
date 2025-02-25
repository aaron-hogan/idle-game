/**
 * Simple type-safe event emitter implementation
 * Used for communication between managers and components
 */
export class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Register a callback for a specific event
   * @param eventName Name of the event to listen for
   * @param callback Function to call when event is emitted
   */
  public on(eventName: string, callback: Function): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    const callbacks = this.listeners.get(eventName);
    if (callbacks && !callbacks.includes(callback)) {
      callbacks.push(callback);
    }
  }

  /**
   * Remove a callback for a specific event
   * @param eventName Name of the event to stop listening for
   * @param callback Function to remove
   */
  public off(eventName: string, callback: Function): void {
    const callbacks = this.listeners.get(eventName);
    
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      
      // Clean up if no listeners remain
      if (callbacks.length === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Emit an event with optional arguments
   * @param eventName Name of the event to emit
   * @param args Arguments to pass to the callbacks
   */
  public emit(eventName: string, ...args: any[]): void {
    const callbacks = this.listeners.get(eventName);
    
    if (callbacks) {
      // Create a copy of the callbacks array to safely iterate
      // This prevents issues if callbacks modify the listeners during iteration
      const callbacksCopy = [...callbacks];
      
      for (const callback of callbacksCopy) {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
          // Continue with other callbacks despite errors
        }
      }
    }
  }

  /**
   * Check if an event has any listeners
   * @param eventName Name of the event to check
   * @returns True if the event has at least one listener
   */
  public hasListeners(eventName: string): boolean {
    const callbacks = this.listeners.get(eventName);
    return !!callbacks && callbacks.length > 0;
  }

  /**
   * Remove all listeners for a specific event
   * @param eventName Name of the event to clear listeners for
   */
  public clearListeners(eventName: string): void {
    this.listeners.delete(eventName);
  }

  /**
   * Remove all event listeners
   */
  public clearAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName Name of the event to count listeners for
   * @returns Number of listeners for the event
   */
  public listenerCount(eventName: string): number {
    const callbacks = this.listeners.get(eventName);
    return callbacks ? callbacks.length : 0;
  }
}