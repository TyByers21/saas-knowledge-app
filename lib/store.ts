import { create } from 'zustand';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface StoreState {
    conversation: Message[];
    addMessage: (msg: Message) => void;
    clearConversation: () => void;
}

export const useStore = create<StoreState>((set) => ({
    conversation: [],
    addMessage: (msg) =>
        set((state) => ({
            conversation: [...state.conversation, msg],
        })),
    clearConversation: () => set({ conversation: [] }),
}));
