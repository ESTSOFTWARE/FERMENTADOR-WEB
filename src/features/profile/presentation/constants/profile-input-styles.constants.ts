import type { CSSProperties } from 'react'

export const inputStyle: CSSProperties = {
  width: '100%', backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D',
  borderRadius: 10, color: '#F4F4F5', fontSize: 13, padding: '11px 14px',
  fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

export const labelStyle: CSSProperties = {
  display: 'block', color: '#71717A', fontSize: 10,
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
}

export const readonlyStyle: CSSProperties = {
  ...inputStyle, backgroundColor: '#0D0D0F',
  border: '1px solid #1F1F22', color: '#52525B', cursor: 'default',
}
