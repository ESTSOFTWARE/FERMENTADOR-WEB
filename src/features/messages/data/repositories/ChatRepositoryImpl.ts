import { chatApi }                       from '../api/chatApi'
import type { CreateConversationRequest } from '../../domain/dtos/request/create-conversation.request'
import type { UpdateConversationRequest } from '../../domain/dtos/request/update-conversation.request'
import type { SendMessageRequest }        from '../../domain/dtos/request/send-message.request'
import type { EditMessageRequest }        from '../../domain/dtos/request/edit-message.request'
import type { SetPriorityRequest }        from '../../domain/dtos/request/set-priority.request'
import type { ReactionRequest }           from '../../domain/dtos/request/reaction.request'
import type { Conversation }              from '../../domain/models/Conversation'
import type { ChatMessage }               from '../../domain/models/ChatMessage'
import type { ChatMember }                from '../../domain/models/ChatMember'
import type { MessageAttachment }         from '../../domain/models/MessageAttachment'
import type { ChatRepository }            from '../../domain/repositories/ChatRepository'

export class ChatRepositoryImpl implements ChatRepository {
  getConversations():                                              Promise<Conversation[]>          { return chatApi.getConversations() }
  getContacts():                                                   Promise<ChatMember[]>            { return chatApi.getContacts() }
  createConversation(data: CreateConversationRequest):             Promise<Conversation>            { return chatApi.createConversation(data) }
  updateConversation(id: string, data: UpdateConversationRequest): Promise<Conversation>            { return chatApi.updateConversation(id, data) }
  leaveConversation(id: string):                                   Promise<void>                    { return chatApi.leaveConversation(id) }
  markRead(conversationId: string):                                Promise<void>                    { return chatApi.markRead(conversationId) }
  getMessages(conversationId: string):                             Promise<ChatMessage[]>           { return chatApi.getMessages(conversationId) }
  sendMessage(conversationId: string, data: SendMessageRequest):   Promise<ChatMessage>             { return chatApi.sendMessage(conversationId, data) }
  editMessage(messageId: string, data: EditMessageRequest):        Promise<ChatMessage>             { return chatApi.editMessage(messageId, data) }
  deleteMessage(messageId: string):                                Promise<void>                    { return chatApi.deleteMessage(messageId) }
  pinMessage(messageId: string):                                   Promise<boolean>                 { return chatApi.pinMessage(messageId) }
  setPriority(messageId: string, data: SetPriorityRequest):        Promise<void>                    { return chatApi.setPriority(messageId, data) }
  toggleReaction(messageId: string, data: ReactionRequest):        Promise<Record<string, string[]>> { return chatApi.toggleReaction(messageId, data) }
  uploadFile(file: File):                                          Promise<MessageAttachment>       { return chatApi.uploadFile(file) }
}
