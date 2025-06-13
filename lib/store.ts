// lib/store.ts
import { create } from 'zustand';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface VisualMessage {
    type: 'visual';
    data: any;
    timestamp: number;
}

interface StoreState {
    conversation: Message[];
    visuals: VisualMessage[];
    addMessage: (msg: Message) => void;
    clearConversation: () => void;
    addVisual: (visual: VisualMessage) => void;
    clearVisuals: () => void;
}

export const useStore = create<StoreState>((set) => ({
    conversation: [],
    visuals: [],
    addMessage: (msg) =>
        set((state) => ({
            conversation: [...state.conversation, msg],
        })),
    clearConversation: () => set({ conversation: [] }),
    addVisual: (visual) =>
        set((state) => ({
            visuals: [visual, ...state.visuals],
        })),
    clearVisuals: () => set({ visuals: [] }),
}));
