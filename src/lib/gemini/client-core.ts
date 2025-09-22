import { GoogleGenAI } from '@google/genai';

export class GeminiCoreClient {
  protected client: GoogleGenAI | null = null;
  protected apiKey: string | null = null;
  protected selectedModel: string | null = null;

  constructor(apiKey?: string, selectedModel?: string) {
    if (selectedModel) {
      this.selectedModel = selectedModel;
    }
    if (apiKey) {
      this.setApiKey(apiKey, selectedModel);
    }
  }

  setApiKey(apiKey: string, selectedModel?: string): void {
    this.apiKey = apiKey;
    this.client = new GoogleGenAI({ apiKey });
    if (selectedModel) {
      this.selectedModel = selectedModel;
    }
  }

  setSelectedModel(modelId: string): void {
    this.selectedModel = modelId;
    if (this.apiKey) {
      this.setApiKey(this.apiKey, modelId);
    }
  }

  getSelectedModel(): string | null {
    return this.selectedModel;
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== null;
  }
}
