import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number'
import { cn } from '@/lib/utils'
import type { PaginationBarProps } from '../types/pagination-bar-props.types'

const PaginationBar = ({ page, totalPages, onPrev, onNext, actions, className }: PaginationBarProps) => (
  <div className={cn('flex-shrink-0 flex justify-center py-4', className)}>
    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-2 shadow-lg">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      <div className="flex items-center gap-1.5 text-sm tabular-nums px-3">
        <SlidingNumber className="text-white font-medium text-sm" number={page} />
        <span className="text-neutral-600 text-sm">/ {totalPages}</span>
      </div>

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      {actions && (
        <>
          <div className="w-px h-5 bg-neutral-800 mx-1 flex-shrink-0" />
          {actions}
        </>
      )}
    </div>
  </div>
)

export default PaginationBar
