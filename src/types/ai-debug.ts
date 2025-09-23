export type AIModel = string;

export interface APIConfig {
  apiKey: string;
  baseUrl: string;
  urlSuffix: string;
  modelName?: string;
  temperature: number;
  maxTokens: number;
  context: string;
}

export interface Message {
  id: string;
  type: 'system' | 'assistant' | 'user';
  content: string;
  reasoning_content?: string;
}

export interface ModelConfig {
  [key: string]: APIConfig;
}

export type ConversationMode = 'stream' | 'non-stream';