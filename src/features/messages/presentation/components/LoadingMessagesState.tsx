interface LoadingMessagesStateProps {
  rows?: number
}

export const LoadingMessagesState = ({ rows = 5 }: LoadingMessagesStateProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-neutral-900/60 hover:bg-white/[0.02] transition-colors">
          <td className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse flex-shrink-0" />
              <div className="h-4 bg-neutral-800 rounded w-24 animate-pulse" />
            </div>
          </td>
          <td className="px-8 py-5">
            <div className="h-4 bg-neutral-800 rounded w-48 animate-pulse" />
          </td>
          <td className="px-6 py-5">
            <div className="h-6 w-20 bg-neutral-800 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 bg-neutral-800 rounded w-16 animate-pulse" />
          </td>
          <td className="px-8 py-5 text-right">
            <div className="inline-block h-8 w-8 bg-neutral-800 rounded-lg animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  )
}
