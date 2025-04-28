import { useEffect } from 'react';

// Define types
interface Notification {
  id?: string;
  content: string;
  timestamp?: Date;
}

interface RoomStatus {
  status: 'available' | 'booked';
  bookedBy?: string;
  timestamp?: Date;
}

interface EventStore {
  connected: boolean;
  notifications: Notification[];
  roomStatuses: Record<string, RoomStatus>;
  eventSource: EventSource | null;
  connect: (studentId: string) => void;
  disconnect: () => void;
  clearNotifications: () => void;
}

// Simple event emitter to replace zustand (since you don't have it installed)
class EventEmitter {
  private static instance: EventEmitter | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private state: {
    connected: boolean;
    notifications: Notification[];
    roomStatuses: Record<string, RoomStatus>;
    eventSource: EventSource | null;
  } = {
    connected: false,
    notifications: [],
    roomStatuses: {},
    eventSource: null
  };

  private constructor() {}

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  public getState(): typeof this.state {
    return this.state;
  }

  public setState(updater: (state: typeof this.state) => Partial<typeof this.state>): void {
    const updates = updater(this.state);
    this.state = { ...this.state, ...updates };
    this.emit('stateChanged', this.state);
  }

  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index !== -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

// Create singleton store
const eventEmitter = EventEmitter.getInstance();

// Create functions to use the store
const eventStore: EventStore = {
  get connected() { return eventEmitter.getState().connected; },
  get notifications() { return eventEmitter.getState().notifications; },
  get roomStatuses() { return eventEmitter.getState().roomStatuses; },
  get eventSource() { return eventEmitter.getState().eventSource; },

  connect(studentId: string): void {
    // Close any existing connection
    eventStore.disconnect();
    
    // Create new EventSource
    const eventSource = new EventSource(`/api/events?studentId=${studentId}`);
    
    // Update state
    eventEmitter.setState(() => ({ eventSource }));
    
    // Connection opened
    eventSource.onopen = () => {
      console.log('SSE connection opened');
      eventEmitter.setState(() => ({ connected: true }));
    };
    
    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'notification':
            // Add notification to state
            eventEmitter.setState((state) => ({
              notifications: [
                {
                  id: data.id,
                  content: data.content,
                  timestamp: new Date(data.timestamp)
                },
                ...state.notifications
              ]
            }));
            break;
            
          case 'room-status':
            // Update room status
            eventEmitter.setState((state) => ({
              roomStatuses: {
                ...state.roomStatuses,
                [data.roomId]: {
                  status: data.status,
                  bookedBy: data.bookedBy,
                  timestamp: new Date(data.timestamp)
                }
              }
            }));
            break;
            
          case 'connected':
            console.log('SSE connection confirmed');
            break;
            
          default:
            console.warn('Unknown event type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    // Handle errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventEmitter.setState(() => ({ connected: false }));
      
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        const currentSource = eventEmitter.getState().eventSource;
        if (currentSource === eventSource) {
          eventStore.connect(studentId);
        }
      }, 5000);
    };
  },
  
  disconnect(): void {
    const { eventSource } = eventEmitter.getState();
    if (eventSource) {
      eventSource.close();
      eventEmitter.setState(() => ({ eventSource: null, connected: false }));
    }
  },
  
  clearNotifications(): void {
    eventEmitter.setState(() => ({ notifications: [] }));
  }
};

// React hook for easy integration
export function useRealTimeEvents(studentId?: string): {
  connected: boolean;
  notifications: Notification[];
  roomStatuses: Record<string, RoomStatus>;
} {
  useEffect(() => {
    if (studentId) {
      eventStore.connect(studentId);
      return () => eventStore.disconnect();
    }
  }, [studentId]);
  
  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = eventEmitter.on('stateChanged', () => {
      // Force component re-render
      const _ = Date.now();
    });
    
    return unsubscribe;
  }, []);
  
  return {
    connected: eventStore.connected,
    notifications: eventStore.notifications,
    roomStatuses: eventStore.roomStatuses
  };
}

export default eventStore;
