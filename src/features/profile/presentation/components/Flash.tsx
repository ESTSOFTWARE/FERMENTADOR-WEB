interface Props { msg: string; type: 'success' | 'error' }

export const Flash = ({ msg, type }: Props) => {
  const ok = type === 'success'
  return (
    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: ok ? '#22C55E10' : '#F43F5E10', border: `1px solid ${ok ? '#22C55E30' : '#F43F5E30'}`, color: ok ? '#22C55E' : '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
      {ok
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
      {msg}
    </div>
  )
}
