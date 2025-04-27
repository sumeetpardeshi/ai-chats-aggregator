import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AIModel, ApiKeysConfig, ApiResponse, ChatMessage } from '@/lib/types';
import { defaultModels } from '@/lib/models';

interface AppState {
  apiKeys: ApiKeysConfig;
  models: AIModel[];
  selectedModels: AIModel[];
  responses: ApiResponse[];
  messages: ChatMessage[];
  prompt: string;
  isLoading: boolean;
  summarizationModelId: string | null;
  summary: string | null;
  isSummarizing: boolean;
  
  setApiKey: (name: string, value: string) => void;
  toggleModelSelection: (modelId: string) => void;
  clearSelections: () => void;
  setPrompt: (prompt: string) => void;
  addResponse: (response: ApiResponse) => void;
  clearResponses: () => void;
  setLoading: (isLoading: boolean) => void;
  sendPrompt: (prompt: string) => Promise<void>;
  setSummarizationModel: (modelId: string | null) => void;
  generateSummary: () => Promise<void>;
  clearSummary: () => void;
}

// Create a safer storage implementation that checks if window is defined
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      models: defaultModels,
      selectedModels: [],
      responses: [],
      messages: [],
      prompt: '',
      isLoading: false,
      summarizationModelId: null,
      summary: null,
      isSummarizing: false,
      
      setApiKey: (name, value) => set((state) => ({
        apiKeys: { ...state.apiKeys, [name]: value }
      })),
      
      toggleModelSelection: (modelId) => set((state) => {
        const model = state.models.find(m => m.id === modelId);
        if (!model) return state;
        
        const isCurrentlySelected = state.selectedModels.some(m => m.id === modelId);
        
        return {
          selectedModels: isCurrentlySelected
            ? state.selectedModels.filter(m => m.id !== modelId)
            : [...state.selectedModels, model]
        };
      }),
      
      clearSelections: () => set({ selectedModels: [] }),
      
      setPrompt: (prompt) => set({ prompt }),
      
      addResponse: (response) => set((state) => {
        // Filter out any previous responses from the same model
        const filteredResponses = state.responses.filter(r => r.modelId !== response.modelId);
        
        const newMessages: ChatMessage[] = [
          ...state.messages,
          {
            role: 'assistant',
            content: response.content,
            modelId: response.modelId
          }
        ];
        
        return {
          // Add the new response to the filtered array
          responses: [...filteredResponses, response],
          messages: newMessages,
          // Clear any existing summary when new responses come in
          summary: null
        };
      }),
      
      clearResponses: () => set({ 
        responses: [], 
        messages: [],
        summary: null
      }),
      
      setLoading: (isLoading) => set({ isLoading }),

      setSummarizationModel: (modelId) => set({ 
        summarizationModelId: modelId 
      }),

      clearSummary: () => set({ summary: null }),
      
      generateSummary: async () => {
        const state = get();
        const { responses, summarizationModelId, apiKeys } = state;
        
        if (
          !summarizationModelId || 
          responses.length < 2 || 
          state.isSummarizing
        ) return;
        
        const model = state.models.find(m => m.id === summarizationModelId);
        if (!model) return;
        
        const apiKey = apiKeys[model.apiKeyName];
        if (!apiKey) {
          set({ 
            summary: `Error: API key not provided for ${model.name}` 
          });
          return;
        }
        
        set({ isSummarizing: true });
        
        try {
          // Create a prompt that includes all model responses
          const responsesText = responses.map(response => {
            const modelName = state.models.find(m => m.id === response.modelId)?.name || response.modelId;
            return `${modelName}: ${response.content}`;
          }).join('\n\n---\n\n');
          
          const summaryPrompt = `You are given responses from different AI models to the same user query.


${responsesText}

Task:

Carefully read all responses.

Identify common points and differences.

Summarize the key insights from both responses into a single, cohesive answer.

If there are conflicting opinions, briefly mention them.

Keep the summary concise, neutral, and easy to understand.

Focus on clarity, not just merging the texts.`
           //`I'm going to provide you with responses from different AI models to the same prompt. Please analyze these responses and provide a concise summary combining the responses into a single response.\n\nResponses:\n\n${responsesText}\n\nSummary:`;
          
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: summaryPrompt,
              modelId: summarizationModelId,
              apiKey,
            }),
          });
          
          const data = await response.json();
          
          if (data.error) {
            set({ 
              summary: `Error generating summary: ${data.error}`,
              isSummarizing: false
            });
            return;
          }
          
          set({ 
            summary: data.content,
            isSummarizing: false
          });
        } catch (error) {
          set({ 
            summary: `Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isSummarizing: false
          });
        }
      },
      
      sendPrompt: async (prompt: string) => {
        const state = get();
        if (state.selectedModels.length === 0 || state.isLoading) return;
        
        // Clear previous responses when sending a new prompt
        const userMessage = { role: 'user' as const, content: prompt };
        
        set({ 
          isLoading: true,
          prompt: '',
          responses: [], // Clear previous responses
          messages: [
            ...state.messages,
            userMessage
          ],
          summary: null // Clear any existing summary
        });
        
        try {
          for (const model of state.selectedModels) {
            const apiKey = state.apiKeys[model.apiKeyName];
            if (!apiKey) {
              get().addResponse({
                modelId: model.id,
                content: '',
                error: `API key not provided for ${model.name}`
              });
              continue;
            }
            
            const startTime = Date.now();
            
            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  prompt,
                  modelId: model.id,
                  apiKey,
                }),
              });
              
              const data = await response.json();
              const duration = Date.now() - startTime;
              
              get().addResponse({
                modelId: model.id,
                content: data.content || data.error || 'No content returned',
                error: data.error,
                duration,
              });
            } catch (error) {
              get().addResponse({
                modelId: model.id,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'ai-comparison-storage',
      storage: createJSONStorage(() => safeStorage),
      // Only persist the API keys and selected models
      partialize: (state) => ({ 
        apiKeys: state.apiKeys,
        selectedModels: state.selectedModels,
        summarizationModelId: state.summarizationModelId
      }),
    }
  )
); 