import { create } from 'zustand';

import { Message } from '../domain/models/message';

import { Room } from '@/infra/room/entity/room';

export type ChatStore = {
  messages: Message[];
  username: string;
  rooms: Room[];
  selectedRoomId: string;
  addMessage: (message: Message) => void;
  setUsername: (username: string) => void;
  setRooms: (rooms: Room[]) => void;
  setSelectedRoomId: (roomId: string) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  username: '',
  rooms: [],
  selectedRoomId: '',
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setUsername: (username) => set({ username }),
  clearMessages: () => set({ messages: [] }),
  setRooms: (rooms) => set({ rooms }),
  setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),
}));
