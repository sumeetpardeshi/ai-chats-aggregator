export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  apiKeyName: string;
  apiEndpoint: string;
  maxTokens?: number;
  temperature?: number;
  isSelected?: boolean;
}

export type AIProvider = 
  | "anthropic" 
  | "openai" 
  | "google" 
  | "deepseek" 
  | "mistral" 
  | "cohere" 
  | "custom";

export interface ApiKeysConfig {
  [key: string]: string;
}

export interface ApiResponse {
  modelId: string;
  content: string;
  error?: string;
  duration?: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  modelId?: string;
} 