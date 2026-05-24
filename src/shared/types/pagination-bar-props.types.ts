export interface PaginationBarProps {
  page:       number
  totalPages: number
  total:      number
  pageSize:   number
  onPrev:     () => void
  onNext:     () => void
  actions?:   React.ReactNode
  className?: string
}
