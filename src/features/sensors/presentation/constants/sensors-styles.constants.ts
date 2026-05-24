export const SENSORS_STYLES = `
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sensor-card-wrap { animation: fade-in 0.4s ease both; }
  .sensor-card-wrap:nth-child(1) { animation-delay: 0.05s; }
  .sensor-card-wrap:nth-child(2) { animation-delay: 0.10s; }
  .sensor-card-wrap:nth-child(3) { animation-delay: 0.15s; }
  .sensor-card-wrap:nth-child(4) { animation-delay: 0.20s; }
  .sensor-card-wrap:nth-child(5) { animation-delay: 0.25s; }
  .sensor-card-wrap:nth-child(6) { animation-delay: 0.30s; }
`
