import { getToken } from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    filters?: {
        discipline?: string;
        grade?: string;
        publisher?: string;
    };
}

export interface ChatResponse {
    response: string;
    context_data?: {
        context_text: string;
    };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Chat service to communicate with backend
export const chatService = {
    // Stream a message
    streamMessage: async (
        request: ChatRequest,
        onChunk: (chunk: string) => void
    ): Promise<void> => {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
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
