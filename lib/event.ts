export class Event<T = void> {
    private listeners: ((data: T) => void)[] = [];
  
    subscribe(callback: (data: T) => void) {
      this.listeners.push(callback);
      return {
        unsubscribe: () => this.unsubscribe(callback),
      };
    }
  
    unsubscribe(callback: (data: T) => void) {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    }
  
    invoke(data: T) {
      this.listeners.forEach((cb) => cb(data));
    }
  }
  