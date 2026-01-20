import { api, getToken } from './api';

export interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    filters?: {
        discipline?: string;
        grade?: string;
        publisher?: string;
        model?: string;
    };
    created_at: string;
}

export interface ConversationDetail extends Conversation {
    messages: Message[];
}

export interface ChatFilters {
    discipline?: string;
    grade?: string;
    publisher?: string;
    model?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const conversationService = {
    // List all conversations
    list: async (): Promise<Conversation[]> => {
        return api.get<Conversation[]>('/conversations', true);
    },

    // Create new conversation
    create: async (title?: string): Promise<Conversation> => {
        return api.post<Conversation>('/conversations', { title }, true);
    },

    // Get conversation with messages
    get: async (id: string): Promise<ConversationDetail> => {
        return api.get<ConversationDetail>(`/conversations/${id}`, true);
    },

    // Delete conversation
    delete: async (id: string): Promise<void> => {
        return api.delete(`/conversations/${id}`, true);
    },

    // Send message with streaming
    sendMessage: async (
        conversationId: string,
        message: string,
        filters: ChatFilters,
        onChunk: (chunk: string) => void
    ): Promise<void> => {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message, filters }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            onChunk(chunk);
        }
    },

    // Send guest message (one-time use)
    sendGuestMessage: async (
        message: string,
        filters: ChatFilters,
        onChunk: (chunk: string) => void
    ): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/conversations/guest/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, filters }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            onChunk(chunk);
        }
    },
};

// Filter options
export const DISCIPLINES = [
    { value: '', label: 'Барлық пәндер' },
    { value: 'Қазақстан тарихы', label: 'Қазақстан тарихы' },
];

export const GRADES = [
    { value: '', label: 'Барлық сыныптар' },
    { value: '6', label: '6 сынып' },
    { value: '7', label: '7 сынып' },
    { value: '8', label: '8 сынып' },
    { value: '9', label: '9 сынып' },
    { value: '10', label: '10 сынып' },
    { value: '11', label: '11 сынып' },
];

export const PUBLISHERS = [
    { value: '', label: 'Барлық баспалар' },
    { value: 'Атамұра', label: 'Атамұра' },
    { value: 'Мектеп', label: 'Мектеп' },
];

export const MODELS = [
    { value: 'gemini-1.5-flash', label: 'Gemini Flash (Жылдам)' },
    { value: 'gemini-1.5-pro', label: 'Gemini Pro (Дәлірек)' },
];
