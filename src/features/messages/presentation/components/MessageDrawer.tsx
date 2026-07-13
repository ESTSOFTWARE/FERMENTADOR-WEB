import { AnimatePresence, motion } from 'motion/react'
import type { Conversation } from '../../domain/models/Conversation'
import { MessageHeader } from './MessageHeader'

interface MessageDrawerProps {
  open: boolean
  conversation: Conversation | null
  typingUsers: string[]
  isOnline?: boolean
  onClose: () => void
  onInfo?: () => void
  children: React.ReactNode
}

export const MessageDrawer = ({ open, conversation, typingUsers, isOnline, onClose, onInfo, children }: MessageDrawerProps) => {
  return (
    <AnimatePresence>
      {open && conversation && (
        <>
          <motion.div 
            className="absolute inset-0 bg-black/40 z-10"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
          />

          <motion.div
            className="absolute right-0 top-0 bottom-0 w-[480px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            <MessageHeader
              conversation={conversation}
              typingUsers={typingUsers}
              isOnline={isOnline}
              onClose={onClose}
              onInfo={onInfo}
            />
            
            {/* The rest of the drawer content (messages + input) */}
            <div className="flex-1 flex flex-col min-h-0">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
