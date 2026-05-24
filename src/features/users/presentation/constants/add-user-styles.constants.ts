export const ADD_USER_STYLES = `
  .add-user-input:focus {
    outline: none;
    border-color: #22C55E !important;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
  }
  .add-user-input::placeholder { color: #3F3F46; }
`

export const ADD_USER_INPUT_STYLE: React.CSSProperties = {
  width:           '100%',
  backgroundColor: '#0A0A0B',
  border:          '1px solid #2A2A2D',
  borderRadius:    10,
  color:           '#F4F4F5',
  fontSize:        13,
  padding:         '11px 14px',
  fontFamily:      'Poppins, sans-serif',
  boxSizing:       'border-box',
  transition:      'border-color 0.2s, box-shadow 0.2s',
}

export const ADD_USER_LABEL_STYLE: React.CSSProperties = {
  display:       'block',
  color:         '#71717A',
  fontSize:      10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom:  8,
}
