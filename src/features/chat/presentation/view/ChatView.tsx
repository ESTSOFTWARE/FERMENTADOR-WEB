import { motion } from 'motion/react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useChatViewModel } from '../viewmodels/useChatViewModel'
import { ChatHeader } from '../components/ChatHeader'
import { MessageBubble } from '../components/MessageBubble'
import { TypingIndicator } from '../components/TypingIndicator'
import { ChatEmptyState } from '../components/ChatEmptyState'
import { ChatInput } from '../components/ChatInput'

const ChatView = () => {
  const {
    messages, input, loading,
    bottomRef, textareaRef,
    setInput, adjustHeight, sendMessage, handleKey,
  } = useChatViewModel()

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col bg-[#0A0A0B]"
      style={{ height: 'calc(100vh - 0px)' }}
    >
      <motion.div variants={sectionVariants} className="shrink-0 px-8 pt-7 pb-4 border-b border-neutral-900">
        <ChatHeader />
      </motion.div>

      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4 min-h-0">
        {messages.length === 0 && (
          <ChatEmptyState onSuggestion={sendMessage} />
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        loading={loading}
        textareaRef={textareaRef}
        onChange={setInput}
        onAdjust={adjustHeight}
        onKeyDown={handleKey}
        onSend={sendMessage}
      />
    </motion.div>
  )
}

export default ChatView
