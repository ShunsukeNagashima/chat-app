import { create } from 'zustand';

type WebSocketStore = {
  wsInstance: WebSocket | null;
  setWsInstance: (wsInstance: WebSocket | null) => void;
  connect: (url: string) => void;
  disconnect: () => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  wsInstance: null,
  setWsInstance: (wsInstance) => set({ wsInstance }),
  connect: (url) => {
    const wsInstance = new WebSocket(url);
    set({ wsInstance });
  },
  disconnect: () => {
    const wsInstance = get().wsInstance;
    if (wsInstance) {
      wsInstance.close();
      set({ wsInstance: null });
    }
  },
}));
