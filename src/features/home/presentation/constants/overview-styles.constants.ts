export const OVERVIEW_STYLES = `
  .overview-action-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.25s ease;
    cursor: pointer;
  }
  .overview-action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }
  .overview-stat-card {
    transition: border-color 0.25s ease, background-color 0.25s ease;
  }
  @keyframes pulse-dot {
    0%   { transform: scale(1);   opacity: 0.8; }
    100% { transform: scale(2.4); opacity: 0;   }
  }
`
