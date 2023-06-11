import { create } from 'zustand';

import { Message } from '../domain/models/message';

export type UseChatStore = {
  messages: Message[];
  username: string;
  addMessage: (message: Message) => void;
  setUsername: (username: string) => void;
};

export const useChatStore = create<UseChatStore>((set) => ({
  messages: [],
  username: '',
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setUsername: (username) => set({ username }),
}));
