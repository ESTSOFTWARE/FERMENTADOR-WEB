import type { ChatCompletionRequest } from '../../domain/dtos/request/chat-completion.request'
import type { ChatCompletionResponse } from '../../domain/dtos/response/chat-completion.response'

const API_KEY = import.meta.env.VITE_API_KEY_CHATBOT
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL   = 'llama-3.1-8b-instant'

const BOT_NAME = import.meta.env.VITE_NAME_CHATBOT ?? 'Nich-káBot'

export const SYSTEM_PROMPT = `Eres ${BOT_NAME}, el asistente especializado de Fermest, una plataforma de monitoreo y optimización de fermentación de café con inteligencia artificial.

REGLAS ESTRICTAS:
- SOLO responde preguntas relacionadas con: fermentación de café, pH, temperatura, tiempo de fermentación, perfiles de sabor, procesos de beneficio húmedo/seco, microbiología de la fermentación, sensores IoT, algoritmos genéticos aplicados al café, y el uso de la plataforma Nich-ká.
- Si el usuario pregunta algo fuera de estos temas, responde exactamente: "Solo puedo ayudarte con temas relacionados a la fermentación de café y la plataforma Nich-ká. ¿Tienes alguna pregunta sobre eso?"
- Sé conciso, técnico cuando se requiere y siempre responde en español.
- No saludes con "Hola" repetidamente, ve directo al punto.`

export const chatApi = {
  complete: async (body: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ ...body, model: MODEL }),
    })

    if (res.status === 429) throw new Error('rate_limit')

    const data: ChatCompletionResponse = await res.json()
    if (!res.ok) throw new Error(data?.error?.message ?? `Error ${res.status}`)

    return data
  },
}
