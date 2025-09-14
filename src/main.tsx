import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { injectSpeedInsights } from '@vercel/speed-insights';

createRoot(document.getElementById("root")!).render(<App />);
injectSpeedInsights();
