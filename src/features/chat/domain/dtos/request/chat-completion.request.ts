export interface ChatCompletionRequest {
  model:    string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
}
