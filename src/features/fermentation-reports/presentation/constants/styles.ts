export const REPORTS_STYLES = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  .report-row { cursor: pointer; transition: background-color 0.15s; }
  .report-row:hover { background-color: rgba(255,255,255,0.02) !important; }
  .filter-btn { cursor: pointer; transition: all 0.15s; font-family: Poppins, sans-serif; }
  .filter-btn:hover { border-color: #3F3F46 !important; color: #A1A1AA !important; }
`
