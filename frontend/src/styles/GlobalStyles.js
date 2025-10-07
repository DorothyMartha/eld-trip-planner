import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #0f172a;
    line-height: 1.6;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .leaflet-container {
    height: 500px;
    width: 100%;
    border-radius: 16px;
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow: hidden;
  }

  .leaflet-popup-content {
    font-family: inherit;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 16px;
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 10px 10px -5px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.95);
  }
  
  .leaflet-popup-tip {
    box-shadow: 0 3px 14px rgba(0,0,0,0.1);
  }

  /* Custom icon styles */
  .custom-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .custom-icon.pickup {
    color: #10b981;
  }

  .custom-icon.dropoff {
    color: #ec4899;
  }

  .custom-icon.fuel {
    color: #f97316;
  }

  .custom-icon.rest {
    color: #3b82f6;
  }

  .custom-icon.default {
    color: #6b7280;
  }
`;

export default GlobalStyles;
