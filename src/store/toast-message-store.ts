import { create } from 'zustand';

export type ToastType = 'success' | 'error';

type ToastMessage = {
  type: ToastType;
  message: string;
};

export type ToastMessageStore = {
  toastMessage: ToastMessage | undefined;
  setSuccessToastMessage: (toastMessage: string) => void;
  setErrorToastMessage: (toastMessage: string) => void;
  removeToastMessage: () => void;
};

export const useToastMessageStore = create<ToastMessageStore>((set) => ({
  toastMessage: undefined,
  setSuccessToastMessage: (message: string) => set({ toastMessage: { type: 'success', message } }),
  setErrorToastMessage: (message: string) => set({ toastMessage: { type: 'error', message } }),
  removeToastMessage: () => set({ toastMessage: undefined }),
}));
