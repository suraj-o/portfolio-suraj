// ─── Terminal Theme — Color tokens and shared styles ───

export const COLORS = {
  // Backgrounds
  pageBg: "#1a1a2e",
  terminalBg: "#16162a",
  headerBg: "#1e1e3a",
  border: "#2d2d50",
  statusBar: "#12121f",

  // Prompt
  promptChevron: "#e87040",
  cmdText: "#e8e0d4",
  outputText: "#8a8a9a",

  // Accents
  accentOrange: "#e87040",
  accentPurple: "#c084fc",
  accentGreen: "#4ade80",
  accentRed: "#f87171",
  accentCyan: "#67e8f9",

  // Tags / skill chips
  tagBg: "#1e1e3a",
  tagBorder: "#2d2d50",
  tagText: "#c084fc",

  // AI response
  aiBubbleBg: "#1c1c36",
  aiBubbleBorder: "#3d3d60",
  aiBubbleAccent: "#e87040",
  aiStarIcon: "#e87040",

  // Misc
  muted: "#5a5a7a",
  headerTitle: "#e8e0d4",
  headerSub: "#5a5a7a",
} as const;

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: ${COLORS.pageBg};
    font-family: 'JetBrains Mono', monospace;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.outputText};
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
