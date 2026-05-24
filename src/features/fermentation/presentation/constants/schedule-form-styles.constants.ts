import type { CSSProperties } from 'react'

export const INPUT_BASE_STYLE: CSSProperties = {
  width:           '100%',
  backgroundColor: '#0A0A0B',
  border:          '1px solid #2A2A2D',
  borderRadius:    8,
  color:           '#F4F4F5',
  fontSize:        13,
  padding:         '10px 12px',
  outline:         'none',
  fontFamily:      'Poppins, sans-serif',
  colorScheme:     'dark',
  boxSizing:       'border-box',
}

export const LABEL_BASE_STYLE: CSSProperties = {
  display:       'block',
  color:         '#71717A',
  fontSize:      10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom:  6,
}
