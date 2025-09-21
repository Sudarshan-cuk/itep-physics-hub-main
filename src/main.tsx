import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { injectSpeedInsights } from '@vercel/speed-insights';
import { LoadingProvider } from './contexts/LoadingContext.tsx';

createRoot(document.getElementById("root")!).render(
  <LoadingProvider>
    <App />
  </LoadingProvider>
);
injectSpeedInsights();
