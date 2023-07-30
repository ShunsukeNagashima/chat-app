import { create } from 'zustand';

import { Message } from '../domain/models/message';

import { Room } from '@/domain/models/room';

export type ChatStore = {
  messages: Message[];
  selectedRoom: Room | undefined;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSelectedRoom: (room: Room) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  selectedRoom: undefined,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  clearMessages: () => set({ messages: [] }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
}));
