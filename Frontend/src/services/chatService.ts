import { api } from './api';

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

// Chat service to communicate with backend
export const chatService = {
    // Send a message to the chat API
    sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
        return api.post<ChatResponse>('/chat', request, true);
    },

    // Stream a message (if backend supports streaming)
    streamMessage: async (
        request: ChatRequest,
        onChunk: (chunk: string) => void
    ): Promise<void> => {
        const token = await (await import('./api')).getToken();
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
