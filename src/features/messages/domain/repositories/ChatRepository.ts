import type { CreateConversationRequest } from '../dtos/request/create-conversation.request'
import type { UpdateConversationRequest } from '../dtos/request/update-conversation.request'
import type { SendMessageRequest }        from '../dtos/request/send-message.request'
import type { EditMessageRequest }        from '../dtos/request/edit-message.request'
import type { SetPriorityRequest }        from '../dtos/request/set-priority.request'
import type { ReactionRequest }           from '../dtos/request/reaction.request'
import type { Conversation }              from '../models/Conversation'
import type { ChatMessage }               from '../models/ChatMessage'
import type { ChatMember }                from '../models/ChatMember'
import type { MessageAttachment }         from '../models/MessageAttachment'

export interface ChatRepository {
  getConversations():                                            Promise<Conversation[]>
  getContacts():                                                 Promise<ChatMember[]>
  createConversation(data: CreateConversationRequest):           Promise<Conversation>
  updateConversation(id: string, data: UpdateConversationRequest): Promise<Conversation>
  leaveConversation(id: string):                                 Promise<void>
  markRead(conversationId: string):                              Promise<void>
  getMessages(conversationId: string):                           Promise<ChatMessage[]>
  sendMessage(conversationId: string, data: SendMessageRequest): Promise<ChatMessage>
  editMessage(messageId: string, data: EditMessageRequest):      Promise<ChatMessage>
  deleteMessage(messageId: string):                              Promise<void>
  pinMessage(messageId: string):                                 Promise<boolean>
  setPriority(messageId: string, data: SetPriorityRequest):      Promise<void>
  toggleReaction(messageId: string, data: ReactionRequest):      Promise<Record<string, string[]>>
  uploadFile(file: File):                                        Promise<MessageAttachment>
}
