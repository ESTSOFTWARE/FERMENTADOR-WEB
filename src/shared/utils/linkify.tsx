const URL_REGEX = /(https?:\/\/[^\s]+)/g

export const linkify = (text: string) => {
  const parts = text.split(URL_REGEX)
  return parts.map((part, i) =>
    URL_REGEX.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#38BDF8', textDecoration: 'underline', textUnderlineOffset: 2, wordBreak: 'break-all' }}
        onClick={e => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}
