import type { ChatRepository } from '../../domain/repositories/ChatRepository'
import type { Message } from '../../domain/models/Message'
import { chatApi, SYSTEM_PROMPT } from '../api/chatApi'

export class ChatRepositoryImpl implements ChatRepository {
  async sendMessage(history: Message[], userText: string): Promise<string> {
    const data = await chatApi.complete({
      model: '',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({
          role:    m.role === 'model' ? 'assistant' : 'user' as 'assistant' | 'user',
          content: m.text,
        })),
        { role: 'user', content: userText },
      ],
    })

    return data?.choices?.[0]?.message?.content ?? 'No pude generar una respuesta.'
  }
}
