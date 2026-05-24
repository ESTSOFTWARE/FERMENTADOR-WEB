export interface ChatCompletionResponse {
  choices: Array<{ message: { content: string } }>
  error?:  { message: string }
}
